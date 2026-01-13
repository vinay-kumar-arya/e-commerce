import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { UsersService } from '../../core/services/users.service';
import { PageEvent } from '@angular/material/paginator';
import { UserModalComponent } from '../user-modal/user-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteUserModalComponent } from '../delete-modal/delete-modal.component';
import { ProductsService } from '../../core/services/products.service';
import { ProductModalComponent } from '../product-modal/product-modal.component';
import { CategoriesService } from '../../core/services/categories.service';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent {
  readonly panelOpenState = signal(false);
  products: any = {};
  toppings = new FormControl([
    'productId',
    'name',
    'description',
    'category.name',
    'price',
    'status',
    'imageUrl',
  ]);
  productColumn = [
    { key: 'productId', label: 'Product Id', type: 'text' },
    {
      key: 'name',
      label: 'Product Name',
      type: 'text',
    },
    { key: 'description', label: 'Description', type: 'text' },
    { key: 'category.name', label: 'Category', type: 'text' },
    { key: 'price', label: 'Price (in rupees)', type: 'text' },
    { key: 'status', label: 'Status', type: 'text' },
    { key: 'imageUrl', label: 'Image', type: 'img' },
    { key: '_id', label: 'Object ID', type: 'text' },
    { key: 'deleted', label: 'Deleted Status', type: 'text' },
    { key: 'category.status', label: 'Category status', type: 'text' },
  ];

  get selectedColumns() {
    const selectedKeys = this.toppings.value || [];
    return this.productColumn.filter((col) => selectedKeys.includes(col.key));
  }

  isAddingProduct = false;
  // editingUserId: string | null = null;

  addingProduct = {
    name: '',
    description: '',
    price: '',
    categoryName: '',
    image: '',
  };

  searchProduct: any = {
    productId: '',
    name: '',
    category: '',
    status: '',
  };
  canDeleted = true;
  categorySearchText: string = '';

  totalProducts = 0;
  currentPage = 1;

  searchError = false;

  constructor(
    private productService: ProductsService,
    private categoryService: CategoriesService,
    private dialog: MatDialog,
    private router: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.router.queryParams.subscribe((params) => {
      this.searchProduct.status = params['status'];

      this.getProducts();
    });
    this.getCategory();
  }

  getProducts() {
    this.productService
      .products(this.currentPage, JSON.stringify(this.searchProduct))
      .subscribe({
        next: (res) => {
          this.products = res;

          this.totalProducts =
            res.total || (Array.isArray(res.Users) ? res.Users.length : 0);
          this.searchError = false;
        },
        error: (err) => {
          console.error('Failed to fetch users:', err);
          this.products = { Users: [] };
          this.searchError = true;
        },
      });
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'active':
        return 'status-active';
      case 'inactive':
        return 'status-inactive';
      default:
        return '';
    }
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.getProducts();
  }

  deleteProduct(id: number) {
    const dialogRef = this.dialog.open(DeleteUserModalComponent, {
      width: '100%',
      maxWidth: '400px',
      data: {
        info: 'product',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.productService.deleteProduct(id).subscribe({
          next: (res) => {
            this.getProducts();
            this.toastr.success(res.message);
          },
          error: (err) => {
            this.toastr.error(err.error.error);
          },
        });
      }
    });
  }

  openEditModal(id: string, product: any) {
    const dialogRef = this.dialog.open(ProductModalComponent, {
      width: '100%',
      maxWidth: '50rem',
      data: {
        _id: product?._id,
        name: product?.name,
        description: product?.description,
        price: product?.price,
        categoryName: product?.category?.name,
        image: product?.image,
        status: product?.status,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.productService.update(id, result).subscribe({
          next: (res) => {
            this.getProducts();
            this.toastr.success(res.message);
          },
          error: (err) => {
            this.toastr.error(err.error.message);
          },
        });
      }
    });
  }

  openAddModal() {
    const dialogRef = this.dialog.open(ProductModalComponent, {
      width: '100%',
      maxWidth: '50rem',
      panelClass: 'modern-product-dialog',
      data: {
        name: this.addingProduct?.name,
        description: this.addingProduct?.description,
        price: this.addingProduct?.price,
        categoryName: this.addingProduct?.categoryName,
        image: this.addingProduct?.image,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.productService.addProduct(result).subscribe({
          next: (res) => {
            this.getProducts();
            this.addingProduct = {
              name: '',
              description: '',
              price: '',
              categoryName: '',
              image: '',
            };
            this.isAddingProduct = false;

            this.toastr.success(res.message);
          },
          error: (err) => {
            this.toastr.error(err.error?.error);
          },
        });
      }
    });
  }

  categories: any;

  getCategory() {
    this.categoryService.fetchCategoryList().subscribe({
      next: (res) => {
        this.categories = res.data || [];
      },
      error: (err) => {
        console.log(err.error.error);
      },
    });
  }

  isColumnSelected(key: string): boolean {
    return this.toppings.value?.includes(key) ?? false;
  }

  onColumnToggle(key: string, event: Event) {
    const input = event.target as HTMLInputElement;
    const current = this.toppings.value ?? [];

    if (input.checked) {
      this.toppings.setValue([...current, key]);
    } else {
      this.toppings.setValue(current.filter((v) => v !== key));
    }
  }
}
