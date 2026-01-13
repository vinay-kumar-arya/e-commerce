import Product from "../../../models/Product.js";
import mongoose from "mongoose";

export const getAllProducts = async (req, res) => {
  try {
    let { search = "{}", page = 1, limit = 10 } = req.query;

    try {
      search = JSON.parse(search);
    } catch {
      return res
        .status(400)
        .json({ message: "Invalid search query format. Must be valid JSON." });
    }

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    const matchStage = {};

    if (search.name) {
      matchStage.name = { $regex: search.name, $options: "i" };
    }

    if (search.productId) {
      const parsedId = parseInt(search.productId);
      if (isNaN(parsedId)) {
        return res
          .status(400)
          .json({ message: "Invalid productId. Must be a number." });
      }
      matchStage.productId = parsedId;
    }

    if (
      search.status === "active" ||
      search.status === "inactive" ||
      search.status === "deleted"
    ) {
      matchStage.status = search.status;
    } else if (!search.status || search.status === "") {
      matchStage.status = { $ne: "deleted" }; // default: exclude deleted
    } else {
      return res.status(400).json({
        message: "Invalid status. Must be 'active', 'inactive', or 'deleted'.",
      });
    }

    const pipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
    ];

    if (search.category) {
      pipeline.push({
        $match: {
          "category.name": search.category,
        },
      });
    }

    pipeline.push(
      {
        $project: {
          name: 1,
          description: 1,
          price: 1,
          category: { name: 1 },
          productId: 1,
          image: 1,
          status: 1,
        },
      },
      { $sort: { productId: 1 } },
      {
        $facet: {
          paginatedResults: [{ $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: "count" }],
        },
      }
    );

    const result = await Product.aggregate(pipeline);

    const products = result[0].paginatedResults.map((product) => ({
      ...product,
      imageUrl: product.image
        ? `${req.protocol}://${req.get("host")}/uploads/${product.image}`
        : null,
    }));

    res.status(200).json({
      products,
      total: result[0].totalCount[0]?.count || 0,
      page,
      pages: Math.ceil((result[0].totalCount[0]?.count || 0) / limit),
    });
  } catch (err) {
    console.error("Get All Products Error:", err);
    res.status(500).json({ message: "An unexpected error occurred." });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID." });
    }

    const filter = { _id: id };
    if (status === "active" || status === "inactive" || status === "deleted") {
      filter.status = status;
    } else {
      filter.status = { $ne: "deleted" };
    }

    const product = await Product.findOne(filter)
      .populate("category", "name")
      .lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    const productObj = {
      ...product,
      imageUrl: product.image
        ? `${req.protocol}://${req.get("host")}/uploads/${product.image}`
        : null,
    };

    res.status(200).json(productObj);
  } catch (err) {
    console.error("Get Product By ID Error:", err);
    res.status(500).json({ message: "An unexpected error occurred." });
  }
};
