import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdminProfileComponent } from '../admin-profile/admin-profile.component';

@Component({
  selector: 'app-modal',
  templateUrl: './edit-admin-modal.component.html',
  styleUrl: './edit-admin-modal.component.css',
})
export class EditAdminModuleComponent {
  constructor(
    public dialogRef: MatDialogRef<AdminProfileComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { name: string; email: string }
  ) {}

  onSave(): void {
    this.dialogRef.close(this.data);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
