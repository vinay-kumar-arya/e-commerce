import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GetAdminService } from '../../core/services/get-admin.service';
import { EditAdminModuleComponent } from '../edit-admin-modal/edit-admin-modal.component';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css'],
})
export class AdminProfileComponent implements OnInit {
  adminInfo: any;

  constructor(private getAdmin: GetAdminService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getAdminData();
  }

  getAdminData() {
    this.getAdmin.admin().subscribe({
      next: (res) => {
        this.adminInfo = res;
      },
      error: (err) => {
        console.error('Failed to fetch admin data:', err);
      },
    });
  }

  openEditModal() {
    const dialogRef = this.dialog.open(EditAdminModuleComponent, {
      width: '100%',
      maxWidth: '400px',
      data: {
        name: this.adminInfo?.admin.name,
        email: this.adminInfo?.admin.email,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAdmin.update(result).subscribe({
          next: (res) => {
            this.adminInfo = res;
            this.getAdminData();
          },
          error: (err) => {
            console.error('Update failed:', err);
          },
        });
      }
    });
  }
}
