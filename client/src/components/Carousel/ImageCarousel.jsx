import React from "react";
import { Carousel } from "bootstrap";

const ImageCarousel = ({ images }) => {
  return (
    <Carousel>
      {images.map((url, index) => {
        <Carousel.Item key={index}>
          <img
            src={url}
            alt="electronics"
            className="d-block w-10"
            style={{ height: "500px", objectFit: "cover" }}
          />
        </Carousel.Item>;
      })}
    </Carousel>
  );
};

export default ImageCarousel;
