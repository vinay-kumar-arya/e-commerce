import React, { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import axios from "axios";
import "./ImageCarousel.css";

function ImageCarousel() {
  const [images, setImages] = useState([]);
  const API = import.meta.env.VITE_REACT_APP_API;

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const res = await axios.get(`${API}/api/uploads/get`);
    setImages(res.data.images);
  };

  if (!images.length) return null;

  return (
    <div className="carousel-wrapper">
      <Carousel
        fade
        interval={3500}
        indicators
        controls
        pause="hover"
      >
        {images.map((url, index) => (
          <Carousel.Item key={index}>
            <img
              src={url}
              alt={`banner-${index}`}
              className="carousel-image"
            />
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}

export default ImageCarousel;
