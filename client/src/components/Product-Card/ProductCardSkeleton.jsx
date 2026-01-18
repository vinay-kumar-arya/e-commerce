import "./ProductCard.css";

const ProductCardSkeleton = () => (
  <div className="product-card skeleton">
    <div className="skeleton-image" />
    <div className="skeleton-content">
      <div className="skeleton-line short" />
      <div className="skeleton-line" />
      <div className="skeleton-btn" />
    </div>
  </div>
);

export default ProductCardSkeleton;
