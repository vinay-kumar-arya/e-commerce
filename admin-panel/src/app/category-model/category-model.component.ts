import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-category-model',
  templateUrl: './category-model.component.html',
  styleUrl: './category-model.component.css',
})
export class CategoryModelComponent {
  constructor(
    public dialogRef: MatDialogRef<CategoryModelComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      _id: string;
      name: string;
      description: string;
      status: string;
    }
  ) {}

  onSave(): void {
    this.dialogRef.close(this.data);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
