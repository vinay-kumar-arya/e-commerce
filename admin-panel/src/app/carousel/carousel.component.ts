import { Component, OnInit } from '@angular/core';
import { CarouselService } from './../../core/services/carousel.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
})
export class CarouselComponent implements OnInit {
  files: File[] = [];
  images: string[] = [];

  constructor(private carouselService: CarouselService) {}

  ngOnInit() {
    this.loadImages();
  }

  onFileSelect(event: any) {
    this.files = Array.from(event.target.files);
  }

  upload() {
    const formData = new FormData();
    this.files.forEach((file) => formData.append('images', file));

    this.carouselService.uploadImages(formData).subscribe(() => {
      this.loadImages();
    });
  }

  loadImages() {
    this.carouselService.getImages().subscribe((res) => {
      this.images = res.images;
    });
  }
}
