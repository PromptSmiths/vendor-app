import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedModule } from '../../../shared/shared.module';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  hidePassword = true;
  returnUrl = '/procurement/dashboard';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Get return url from route parameters or default to '/procurement/dashboard'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/procurement/dashboard';
    
    // If already authenticated, redirect
    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      
      const credentials = this.loginForm.value;
      
      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.snackBar.open('Login successful!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          
          // Add debugging and ensure navigation works
          console.log('Login successful, navigating to:', this.returnUrl);
          
          // Try multiple navigation approaches
          setTimeout(() => {
            // First try the return URL
            this.router.navigateByUrl(this.returnUrl).then(success => {
              console.log('Navigation to', this.returnUrl, 'success:', success);
              if (!success) {
                console.error('Navigation failed, trying alternative route');
                // Try alternative routes
                this.router.navigateByUrl('/procurement/dashboard').then(success2 => {
                  console.log('Alternative navigation success:', success2);
                  if (!success2) {
                    // Final fallback - reload the page to the dashboard
                    console.log('All navigation failed, reloading to dashboard');
                    window.location.href = '/procurement/dashboard';
                  }
                });
              }
            }).catch(error => {
              console.error('Navigation error:', error);
              window.location.href = '/procurement/dashboard';
            });
          }, 100);
        },
        error: (error) => {
          this.isLoading = false;
          const message = error.error?.message || 'Login failed. Please check your credentials.';
          this.snackBar.open(message, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  getEmailErrorMessage(): string {
    const emailControl = this.loginForm.get('email');
    if (emailControl?.hasError('required')) {
      return 'Email is required';
    }
    if (emailControl?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    return '';
  }

  getPasswordErrorMessage(): string {
    const passwordControl = this.loginForm.get('password');
    if (passwordControl?.hasError('required')) {
      return 'Password is required';
    }
    if (passwordControl?.hasError('minlength')) {
      return 'Password must be at least 6 characters';
    }
    return '';
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }
}