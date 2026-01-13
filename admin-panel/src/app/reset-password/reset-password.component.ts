import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ResetPasswordService } from '../../core/services/reset-password.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent {
  otpSent = false;
  hide = true;

  PasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    otp: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  constructor(
    private router: Router,
    private resetService: ResetPasswordService
  ) {}

  sendOtp2() {
    const emailCtrl = this.PasswordForm.get('email');
    emailCtrl?.markAsTouched();

    if (emailCtrl?.valid) {
      const email = emailCtrl.value as string;
      this.resetService.sendOtp(email).subscribe({
        next: (res) => {
          if (res.success) this.otpSent = true;
          else emailCtrl.setErrors({ server: res.message || 'Invalid Email' });
        },
        error: (err) =>
          emailCtrl.setErrors({
            server: err.error?.message || 'Something went wrong',
          }),
      });
    }
  }

  submit() {
    this.PasswordForm.markAllAsTouched();
    const pass = this.PasswordForm.get('password')?.value;
    const confirm = this.PasswordForm.get('confirmPassword')?.value;

    if (pass !== confirm) {
      this.PasswordForm.get('confirmPassword')?.setErrors({ mismatch: true });
    }

    if (this.PasswordForm.valid) {
      const data = {
        email: this.PasswordForm.get('email')?.value,
        otp: this.PasswordForm.get('otp')?.value,
        password: pass,
      };
      this.resetService.resetPassword(data).subscribe({
        next: (res) => {
          if (res.success) this.router.navigate(['']);
          else
            this.PasswordForm.get('email')?.setErrors({ server: res.message });
        },
        error: (err) =>
          this.PasswordForm.get('email')?.setErrors({
            server: err.error?.message || 'Something went wrong',
          }),
      });
    }
  }

  login() {
    this.router.navigate(['']);
  }
}
