import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  users: any;
  categories: any;
  products: any;
  orders: any;
  constructor(
    private router: Router,
    private dashboardService: DashboardService,
  ) {}
  ngOnInit() {
    this.getUsers();
    this.getProducts();
    this.getOrders();
    this.getCategories();
  }
  getUsers() {
    this.dashboardService.getUsers().subscribe({
      next: (res) => {
        this.users = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  toUser(path: string, filter: string) {
    this.router.navigate([path], { queryParams: { status: filter } });
  }
  getProducts() {
    this.dashboardService.getProducts().subscribe({
      next: (res) => {
        this.products = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  toProducts(path: string, filter: string) {
    this.router.navigate([path], { queryParams: { status: filter } });
  }
  getOrders() {
    this.dashboardService.getOrders().subscribe({
      next: (res) => {
        this.orders = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  toOrders(path: string, filter: string) {
    this.router.navigate([path], { queryParams: { status: filter } });
  }
  getCategories() {
    this.dashboardService.getCategory().subscribe({
      next: (res) => {
        this.categories = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  toCategories(path: string, filter: string) {
    this.router.navigate([path], { queryParams: { status: filter } });
  }
}
