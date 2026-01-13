import { Component, OnInit, signal } from '@angular/core';
import { OrdersService } from '../../core/services/orders.service';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { OrderModelComponent } from '../order-model/order-model.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent implements OnInit {
  constructor(
    private orderService: OrdersService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private router: ActivatedRoute
  ) {}

  readonly panelOpenState = signal(false);

  totalOrders = 0;
  currentPage = 1;
  pageIndex = 1;

  orders: any;
  ordersColumn = [
    { key: 'orderId', label: 'Order Id', type: 'text' },
    { key: 'user.name', label: 'Buyer Name', type: 'text' },
    { key: 'user.email', label: 'Buyer email', type: 'text' },
    { key: 'products.length', label: 'Product Quantity', type: 'text' },
    { key: 'status', label: 'Order Status', type: 'text' },
    { key: 'shippingAddress.state', label: 'Shipment Address', type: 'text' },
    { key: 'totalPrice', label: 'Grand Total', type: 'text' },
    { key: 'paymentMethod', label: 'Payment Method', type: 'text' },
  ];

  searchOrder: any = {
    orderId: '',
    status: '',
    paymentMethod: '',
  };

  ngOnInit() {
    this.router.queryParams.subscribe((params) => {
      this.searchOrder.status = params['status'];

      this.getOrders();
    });
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.getOrders();
  }

  getOrders() {
    this.orderService
      .orders(this.currentPage, JSON.stringify(this.searchOrder))
      .subscribe({
        next: (res) => {
          this.orders = res.data;

          this.totalOrders =
            res.pagination.total ||
            (Array.isArray(res.data) ? res.data.length : 0);
        },
        error: (err) => {
          console.error('Failed to fetch users:', err);
          this.orders = { Users: [] };
        },
      });
  }

  orderformfield = [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      appearance: 'fill',
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'processing', label: 'Processing' },
        { value: 'shipped', label: 'Shipped' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'cancelled', label: 'Cancelled' },
      ],
      isVisible: true,
      isRequired: true,
    },
  ];

  openEditModal(id: string, product: any) {
    const dialogRef = this.dialog.open(OrderModelComponent, {
      width: '100%',
      maxWidth: '400px',
      data: {
        status: product?.status,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.orderService.update(id, result).subscribe({
          next: (res) => {
            this.getOrders();
            this.toastr.success(res.message);
          },
          error: (err) => {
            this.toastr.error(err.error.message);
          },
        });
      }
    });
  }

  openDropdown: 'payment' | 'status' | null = null;

  toggleDropdown(type: 'payment' | 'status') {
    this.openDropdown = this.openDropdown === type ? null : type;
  }

  selectOption(field: string, value: string) {
    this.searchOrder[field] = value;
    this.openDropdown = null;
  }
}
