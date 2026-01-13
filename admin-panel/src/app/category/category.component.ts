import { Component, OnInit, signal } from '@angular/core';
import { CategoriesService } from '../../core/services/categories.service';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { CategoryModelComponent } from '../category-model/category-model.component';
import { DeleteUserModalComponent } from '../delete-modal/delete-modal.component';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.css',
})
export class CategoryComponent implements OnInit {
  readonly panelOpenState = signal(false);
  categories: any = [];
  isCategoryOpen = false;
  toppings = new FormControl([
    'categoryId',
    'name',
    'description',
    'status',
    'createdAt',
    'productCount',
  ]);
  categoriesColumn = [
    { key: 'categoryId', label: 'Category Id', type: 'text' },
    { key: 'name', label: 'Category Name', type: 'text' },
    { key: 'description', label: 'Description', type: 'text' },
    { key: 'status', label: 'Status', type: 'text' },
    { key: 'createdAt', label: 'Created Date', type: 'date' },
    { key: 'productCount', label: 'Product in stock', type: 'text' },
    { key: '_id', label: 'Object ID', type: 'text' },
    { key: 'createdAt', label: 'Date of Creation', type: 'date' },
  ];

  get selectedColumns() {
    const selectedKeys = this.toppings.value || [];
    return this.categoriesColumn.filter((col) =>
      selectedKeys.includes(col.key)
    );
  }

  isAddingCategory = false;
  // editingUserId: string | null = null;

  addingCategory = {
    _id: '',
    name: '',
    description: '',
    status: '',
  };

  searchCategory: any = {
    categoryId: '',
    name: '',
    status: '',
  };

  categorySearchText: string = '';

  totalCategory = 0;
  currentPage = 1;

  searchError = false;

  constructor(
    private categoryService: CategoriesService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private router: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getCategory();
    this.router.queryParams.subscribe((params) => {
      this.searchCategory.status = params['status'];

      this.searchByCategory();
    });
  }

  localCategory = [];
  searchByCategory() {
    this.categoryService.fetchCategoryList().subscribe({
      next: (res) => {
        this.localCategory = res.data || [];
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  getCategory() {
    this.categoryService
      .category(this.currentPage, JSON.stringify(this.searchCategory))
      .subscribe({
        next: (res) => {
          this.categories = res.data;
          this.totalCategory =
            res.totalCount ||
            (Array.isArray(this.categories) ? this.categories.length : 0);
          this.searchError = false;
          this.toastr.success(res.message);
        },
        error: (err) => {
          console.error('Failed to fetch categories:', err);
          this.categories = err;
          this.searchError = true;
          this.toastr.error(err.error);
        },
      });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'active':
        return 'status-active';
      case 'inactive':
        return 'status-inactive';
      case 'deleted':
        return 'status-inactive';
      default:
        return '';
    }
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.getCategory();
  }

  deleteCategory(id: number) {
    const dialogRef = this.dialog.open(DeleteUserModalComponent, {
      width: '100%',
      maxWidth: '400px',
      data: {
        info: 'product',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.categoryService.delete(id).subscribe({
          next: (res) => {
            this.getCategory();
            this.toastr.success(res.message);
          },
          error: (err) => {
            this.toastr.error(err.message);
          },
        });
      }
    });
  }

  openEditModal(id: string, category: any) {
    const dialogRef = this.dialog.open(CategoryModelComponent, {
      width: '100%',
      maxWidth: '400px',
      data: {
        _id: category?._id,
        name: category?.name,
        description: category?.description,
        status: category?.status,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.categoryService.update(id, result).subscribe({
          next: (res) => {
            this.getCategory();
          },
          error: (err) => {
            console.error('Update failed:', err);
          },
        });
      }
    });
  }

  openAddModal() {
    const dialogRef = this.dialog.open(CategoryModelComponent, {
      width: '100%',
      maxWidth: '400px',
      data: {
        name: this.addingCategory?.name,
        description: this.addingCategory?.description,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.categoryService.addCategory(result).subscribe({
          next: (res) => {
            this.getCategory();
            this.addingCategory = {
              _id: '',
              name: '',
              description: '',
              status: '',
            };
            this.isAddingCategory = false;
            this.toastr.success(res.message);
          },
          error: (err) => {
            this.toastr.error(err.error?.message);
          },
        });
      }
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
