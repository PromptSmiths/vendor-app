import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedModule } from '../../../../shared/shared.module';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { VendorService } from '../../../../core/services/vendor.service';

@Component({
  selector: 'app-vendor-request',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    PageHeaderComponent
  ],
  templateUrl: './vendor-request.component.html',
  styleUrls: ['./vendor-request.component.scss']
})
export class VendorRequestComponent implements OnInit {
  vendorRequestForm: FormGroup;
  isLoading = false;

  categories = [
    { value: 'technology', label: 'Technology & Software' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'logistics', label: 'Logistics & Transportation' },
    { value: 'consulting', label: 'Consulting Services' },
    { value: 'marketing', label: 'Marketing & Advertising' },
    { value: 'finance', label: 'Financial Services' },
    { value: 'legal', label: 'Legal Services' },
    { value: 'healthcare', label: 'Healthcare & Medical' },
    { value: 'construction', label: 'Construction & Real Estate' },
    { value: 'other', label: 'Other' }
  ];

  priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];

  constructor(
    private fb: FormBuilder,
    private vendorService: VendorService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.vendorRequestForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      category: ['', [Validators.required]],
      priority: ['medium', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    // Component initialization
  }

  onSubmit(): void {
    if (this.vendorRequestForm.valid) {
      this.isLoading = true;
      
      const requestData = this.vendorRequestForm.value;
      
      this.vendorService.createVendorRequest(requestData).subscribe({
        next: (vendor) => {
          this.isLoading = false;
          this.snackBar.open('Vendor request created successfully!', 'Close', {
            duration: 5000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/procurement/vendor-detail'], {
            queryParams: { id: vendor.id }
          });
        },
        error: (error) => {
          this.isLoading = false;
          const message = error.error?.message || 'Failed to create vendor request. Please try again.';
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

  onCancel(): void {
    this.router.navigate(['/procurement/dashboard']);
  }

  onReset(): void {
    this.vendorRequestForm.reset({
      priority: 'medium'
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.vendorRequestForm.get(fieldName);
    
    if (control?.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }
    
    if (control?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    
    if (control?.hasError('minlength')) {
      const requiredLength = control.errors?.['minlength']?.requiredLength;
      return `${this.getFieldLabel(fieldName)} must be at least ${requiredLength} characters`;
    }
    
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Vendor Name',
      email: 'Email',
      category: 'Category',
      priority: 'Priority',
      description: 'Description'
    };
    
    return labels[fieldName] || fieldName;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.vendorRequestForm.controls).forEach(key => {
      const control = this.vendorRequestForm.get(key);
      control?.markAsTouched();
    });
  }
}