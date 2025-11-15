import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedModule } from '../../../../shared/shared.module';
import { OnboardingService } from '../../../../core/services/onboarding.service';

@Component({
  selector: 'app-vendor-otp',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule
  ],
  templateUrl: './vendor-otp.component.html',
  styleUrls: ['./vendor-otp.component.scss']
})
export class VendorOtpComponent implements OnInit {
  emailForm: FormGroup;
  otpForm: FormGroup;
  currentStep: 'email' | 'otp' = 'email';
  isLoading = false;
  otpSent = false;
  userEmail = '';

  constructor(
    private fb: FormBuilder,
    private onboardingService: OnboardingService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
    
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]]
    });
  }

  ngOnInit(): void {
    // Component initialization
  }

  sendOtp(): void {
    if (this.emailForm.valid) {
      this.isLoading = true;
      this.userEmail = this.emailForm.value.email;
      
      this.onboardingService.sendOtp({ email: this.userEmail }).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.otpSent = true;
          this.currentStep = 'otp';
          this.snackBar.open('OTP sent successfully! Please check your email.', 'Close', {
            duration: 5000,
            panelClass: ['success-snackbar']
          });
        },
        error: (error) => {
          this.isLoading = false;
          const message = error.error?.message || 'Failed to send OTP. Please try again.';
          this.snackBar.open(message, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      this.emailForm.get('email')?.markAsTouched();
    }
  }

  verifyOtp(): void {
    if (this.otpForm.valid) {
      this.isLoading = true;
      
      const verification = {
        email: this.userEmail,
        otp: this.otpForm.value.otp
      };
      
      this.onboardingService.verifyOtp(verification).subscribe({
        next: (response) => {
          this.isLoading = false;
          localStorage.setItem('onboarding_token', response.token);
          localStorage.setItem('vendor_id', response.vendorId);
          
          this.snackBar.open('OTP verified successfully!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          
          this.router.navigate(['/vendor/onboarding'], {
            queryParams: { step: response.currentStep }
          });
        },
        error: (error) => {
          this.isLoading = false;
          const message = error.error?.message || 'Invalid OTP. Please try again.';
          this.snackBar.open(message, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      this.otpForm.get('otp')?.markAsTouched();
    }
  }

  resendOtp(): void {
    this.sendOtp();
  }

  backToEmail(): void {
    this.currentStep = 'email';
    this.otpSent = false;
    this.otpForm.reset();
  }

  getEmailErrorMessage(): string {
    const emailControl = this.emailForm.get('email');
    if (emailControl?.hasError('required')) {
      return 'Email is required';
    }
    if (emailControl?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    return '';
  }

  getOtpErrorMessage(): string {
    const otpControl = this.otpForm.get('otp');
    if (otpControl?.hasError('required')) {
      return 'OTP is required';
    }
    if (otpControl?.hasError('pattern')) {
      return 'OTP must be 6 digits';
    }
    return '';
  }
}