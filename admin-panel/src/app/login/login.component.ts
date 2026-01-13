import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../core/services/login.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  LoginForm: FormGroup;
  hide = true;

  emailError = '';
  passwordError = '';

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastr: ToastrService
  ) {
    this.LoginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  updateErrorMessage() {
    const emailCtrl = this.LoginForm.get('email');
    if (emailCtrl?.hasError('required')) {
      this.emailError = 'Email is required';
    } else if (emailCtrl?.hasError('email')) {
      this.emailError = 'Enter a valid email address';
    } else {
      this.emailError = '';
    }

    const passCtrl = this.LoginForm.get('password');
    if (passCtrl?.hasError('required')) {
      this.passwordError = 'Password is required';
    } else {
      this.passwordError = '';
    }
  }

  forgotPassword() {
    this.router.navigate(['/reset-password']);
  }

  submit() {
    if (this.LoginForm.valid) {
      const email = this.LoginForm.get('email')?.value;
      const password = this.LoginForm.get('password')?.value;
      this.loginService.login({ email, password }).subscribe({
        next: (response) => {
          if (response.success) {
            localStorage.setItem('token', response.token);
            this.router.navigate(['/layout']);
          } else {
            this.toastr.error(response.message);
          }
        },
        error: (error) => {
          this.toastr.error(error?.error?.message || 'Something went wrong');
        },
      });
    } else {
      this.LoginForm.markAllAsTouched();
    }
  }
}
