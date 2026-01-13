import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GetAdminService } from '../../core/services/get-admin.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  adminName = '';
  sidebarOpen = false;
  isDesktop = false;

  constructor(private router: Router, private getAdmin: GetAdminService) {}

  ngOnInit() {
    this.checkScreen();
    this.getAdminName();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreen();
  }

  checkScreen() {
    this.isDesktop = window.innerWidth > 768;
    if (this.isDesktop) {
      this.sidebarOpen = false;
    }
  }

  toggleSidebar() {
    if (!this.isDesktop) {
      this.sidebarOpen = !this.sidebarOpen;
    }
  }

  navigate(path: string) {
    this.router.navigate([path]);
    if (!this.isDesktop) {
      this.sidebarOpen = false;
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['']);
  }

  getAdminName() {
    this.getAdmin.admin().subscribe({
      next: (res) => {
        this.adminName = res.admin.name;
      },
    });
  }
}
