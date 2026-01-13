import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OrdersComponent } from '../orders/orders.component';

@Component({
  selector: 'app-order-model',
  templateUrl: './order-model.component.html',
  styleUrl: './order-model.component.css',
})
export class OrderModelComponent {
  constructor(
    public dialogRef: MatDialogRef<OrdersComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      status?: string;
    }
  ) {}

  onSave(): void {
    this.dialogRef.close(this.data);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
