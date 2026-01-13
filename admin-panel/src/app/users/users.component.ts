import { Component, OnInit, signal } from '@angular/core';
import { UsersService } from '../../core/services/users.service';
import { PageEvent } from '@angular/material/paginator';
import { UserModalComponent } from '../user-modal/user-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteUserModalComponent } from '../delete-modal/delete-modal.component';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  constructor(
    private userService: UsersService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private router: ActivatedRoute
  ) {}

  readonly panelOpenState = signal(false);
  toppings = new FormControl([
    'userId',
    'name',
    'email',
    'dob',
    'gender',
    'status',
    'createdAt',
  ]);

  users: any;
  usersColumn = [
    { key: 'userId', label: 'User Id', type: 'text' },
    {
      key: 'name',
      label: 'Name',
      type: 'text',
    },
    { key: 'email', label: 'E-mail', type: 'text' },
    { key: 'dob', label: 'Date of Birth', type: 'date' },
    { key: 'gender', label: 'Gender', type: 'text' },
    { key: 'status', label: 'Status', type: 'text' },
    { key: 'createdAt', label: 'Created Date', type: 'date' },
    { key: '__v', label: 'V ID', type: 'text' },
    { key: '_id', label: 'Object ID', type: 'text' },
    { key: 'updatedAt', label: 'Updated Date', type: 'date' },
  ];

  get selectedColumns() {
    const selectedKeys = this.toppings.value || [];
    return this.usersColumn.filter((col) => selectedKeys.includes(col.key));
  }

  isAddingUser = false;
  editingUserId: string | null = null;

  addingUser = {
    name: '',
    dob: '',
    gender: '',
    email: '',
    password: '',
  };

  searchUser: any = {
    userId: '',
    name: '',
    email: '',
    status: '',
    dob: '',
    gender: '',
  };

  totalUsers = 0;
  currentPage = 1;
  pageIndex = 1;

  searchError = false;

  ngOnInit() {
    this.router.queryParams.subscribe((params) => {
      this.searchUser.status = params['status'];
      this.getUser();
    });
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.getUser();
  }

  getUser() {
    this.userService
      .users(this.currentPage, JSON.stringify(this.searchUser))
      .subscribe({
        next: (res) => {
          this.users = res;
          this.totalUsers =
            res.totalUsers || (Array.isArray(res.Users) ? res.Users.length : 0);
          this.searchError = false;
        },
        error: (err) => {
          console.error('Failed to fetch users:', err);
          this.users = { Users: [] };
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
      case 'deleted':
        return 'status-delete';
      default:
        return '';
    }
  }

  deleteUserAccount(id: string) {
    const dialogRef = this.dialog.open(DeleteUserModalComponent, {
      width: '100%',
      maxWidth: '400px',
      data: {
        info: 'user',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.deleteUserAcc(id).subscribe({
          next: (res) => {
            this.getUser();
            this.toastr.success(res.message);
          },
          error: (err) => {
            this.toastr.error(err.message);
          },
        });
      }
    });
  }

  openEditModal(user: any) {
    const dialogRef = this.dialog.open(UserModalComponent, {
      width: '100%',
      maxWidth: '50rem',
      backdropClass: 'blurred-backdrop',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
        dob: user.dob,
        gender: user.gender,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.update(result).subscribe({
          next: (res) => {
            this.getUser();
            this.toastr.success(res.message);
          },
          error: (err) => {
            this.toastr.error(err.message);
          },
        });
      }
    });
  }

  openAddModal() {
    const dialogRef = this.dialog.open(UserModalComponent, {
      width: '100%',
      maxWidth: '50rem',
      backdropClass: 'blurred-backdrop',
      data: {
        name: this.addingUser?.name,
        email: this.addingUser?.email,
        password: this.addingUser?.password,
        dob: this.addingUser?.dob,
        gender: this.addingUser?.gender,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.addUser(result).subscribe({
          next: (res) => {
            this.getUser();
            this.addingUser = {
              name: '',
              email: '',
              password: '',
              dob: '',
              gender: '',
            };
            this.isAddingUser = false;
            this.toastr.success(res.message);
          },
          error: (err) => {
            console.error('Failed to add user:', err);
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
