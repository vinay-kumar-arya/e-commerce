import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductsComponent } from '../products/products.component';
import { CategoriesService } from '../../core/services/categories.service';

@Component({
  selector: 'app-product-modal',
  templateUrl: './product-modal.component.html',
  styleUrl: './product-modal.component.css',
})
export class ProductModalComponent implements OnInit {
  isEditMode = false;
  constructor(
    private categoryService: CategoriesService,
    public dialogRef: MatDialogRef<ProductsComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      _id: string;
      name: string;
      description: string;
      price: string;
      categoryName: string;
      image: string;
      status: string;
    }
  ) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.data.image = file;
    }
  }

  onSave(): void {
    this.dialogRef.close(this.data);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
  categories: any;

  getCategory() {
    this.categoryService.fetchCategoryList().subscribe({
      next: (res) => {
        this.categories = res.data || [];
      },
      error: (err) => {
        console.log(err.error.error.message);
      },
    });
  }

  ngOnInit() {
    this.getCategory();
  }
}
