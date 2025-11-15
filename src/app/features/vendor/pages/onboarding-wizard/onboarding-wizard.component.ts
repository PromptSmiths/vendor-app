import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatStepper } from '@angular/material/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedModule } from '../../../../shared/shared.module';
import { OnboardingService, BusinessDetails, ContactDetails, BankingDetails, ComplianceDetails } from '../../../../core/services/onboarding.service';

@Component({
  selector: 'app-onboarding-wizard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule
  ],
  templateUrl: './onboarding-wizard.component.html',
  styleUrls: ['./onboarding-wizard.component.scss']
})
export class OnboardingWizardComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;
  
  businessForm!: FormGroup;
  contactForm!: FormGroup;
  bankingForm!: FormGroup;
  complianceForm!: FormGroup;
  
  isLoading = false;
  currentStep = 0;
  onboardingToken = '';
  
  businessTypes = [
    { value: 'corporation', label: 'Corporation' },
    { value: 'llc', label: 'Limited Liability Company (LLC)' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'sole-proprietorship', label: 'Sole Proprietorship' },
    { value: 'non-profit', label: 'Non-Profit Organization' }
  ];
  
  countries = [
    { value: 'US', label: 'United States' },
    { value: 'CA', label: 'Canada' },
    { value: 'MX', label: 'Mexico' },
    { value: 'GB', label: 'United Kingdom' },
    { value: 'DE', label: 'Germany' },
    { value: 'FR', label: 'France' }
  ];
  
  accountTypes = [
    { value: 'checking', label: 'Checking Account' },
    { value: 'savings', label: 'Savings Account' }
  ];
  
  certifications = [
    'ISO 9001',
    'ISO 14001',
    'ISO 27001',
    'SOC 2 Type II',
    'PCI DSS',
    'HIPAA',
    'FDA Compliance',
    'GDPR Compliance'
  ];
  
  qualityStandards = [
    'Six Sigma',
    'Lean Manufacturing',
    'Total Quality Management',
    'Kaizen',
    'Statistical Process Control'
  ];

  constructor(
    private fb: FormBuilder,
    private onboardingService: OnboardingService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.onboardingToken = localStorage.getItem('onboarding_token') || '';
    
    if (!this.onboardingToken) {
      this.router.navigate(['/vendor/otp']);
      return;
    }
    
    // Check for step parameter
    this.route.queryParams.subscribe(params => {
      if (params['step']) {
        this.currentStep = parseInt(params['step'], 10);
      }
    });
    
    this.loadOnboardingState();
  }

  initializeForms(): void {
    this.businessForm = this.fb.group({
      companyName: ['', [Validators.required, Validators.minLength(2)]],
      businessType: ['', [Validators.required]],
      taxId: ['', [Validators.required]],
      registrationNumber: ['', [Validators.required]],
      website: [''],
      description: ['', [Validators.required, Validators.minLength(10)]],
      establishedYear: ['', [Validators.required, Validators.min(1800), Validators.max(new Date().getFullYear())]],
      employees: ['', [Validators.required, Validators.min(1)]]
    });
    
    this.contactForm = this.fb.group({
      primaryContactName: ['', [Validators.required]],
      primaryContactEmail: ['', [Validators.required, Validators.email]],
      primaryContactPhone: ['', [Validators.required]],
      secondaryContactName: [''],
      secondaryContactEmail: ['', [Validators.email]],
      secondaryContactPhone: [''],
      address: this.fb.group({
        street: ['', [Validators.required]],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        zipCode: ['', [Validators.required]],
        country: ['', [Validators.required]]
      })
    });
    
    this.bankingForm = this.fb.group({
      bankName: ['', [Validators.required]],
      accountNumber: ['', [Validators.required]],
      routingNumber: ['', [Validators.required]],
      accountType: ['', [Validators.required]],
      bankAddress: this.fb.group({
        street: ['', [Validators.required]],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        zipCode: ['', [Validators.required]]
      })
    });
    
    this.complianceForm = this.fb.group({
      certifications: [[]],
      insuranceDetails: this.fb.group({
        provider: ['', [Validators.required]],
        policyNumber: ['', [Validators.required]],
        coverage: ['', [Validators.required]],
        expiryDate: ['', [Validators.required]]
      }),
      qualityStandards: [[]]
    });
  }

  loadOnboardingState(): void {
    this.onboardingService.getOnboardingState(this.onboardingToken).subscribe({
      next: (state) => {
        this.currentStep = state.currentStep;
        if (this.stepper) {
          this.stepper.selectedIndex = this.currentStep;
        }
      },
      error: (error) => {
        console.error('Error loading onboarding state:', error);
      }
    });
  }

  submitBusinessDetails(): void {
    if (this.businessForm.valid) {
      this.isLoading = true;
      
      const businessDetails: BusinessDetails = this.businessForm.value;
      
      this.onboardingService.submitBusinessDetails(businessDetails, this.onboardingToken).subscribe({
        next: () => {
          this.isLoading = false;
          this.showSuccessMessage('Business details saved successfully!');
          this.moveToNextStep();
        },
        error: (error) => {
          this.isLoading = false;
          this.showErrorMessage('Failed to save business details');
        }
      });
    } else {
      this.markFormGroupTouched(this.businessForm);
    }
  }

  submitContactDetails(): void {
    if (this.contactForm.valid) {
      this.isLoading = true;
      
      const contactDetails: ContactDetails = this.contactForm.value;
      
      this.onboardingService.submitContactDetails(contactDetails, this.onboardingToken).subscribe({
        next: () => {
          this.isLoading = false;
          this.showSuccessMessage('Contact details saved successfully!');
          this.moveToNextStep();
        },
        error: (error) => {
          this.isLoading = false;
          this.showErrorMessage('Failed to save contact details');
        }
      });
    } else {
      this.markFormGroupTouched(this.contactForm);
    }
  }

  submitBankingDetails(): void {
    if (this.bankingForm.valid) {
      this.isLoading = true;
      
      const bankingDetails: BankingDetails = this.bankingForm.value;
      
      this.onboardingService.submitBankingDetails(bankingDetails, this.onboardingToken).subscribe({
        next: () => {
          this.isLoading = false;
          this.showSuccessMessage('Banking details saved successfully!');
          this.moveToNextStep();
        },
        error: (error) => {
          this.isLoading = false;
          this.showErrorMessage('Failed to save banking details');
        }
      });
    } else {
      this.markFormGroupTouched(this.bankingForm);
    }
  }

  submitComplianceDetails(): void {
    if (this.complianceForm.valid) {
      this.isLoading = true;
      
      const complianceDetails: ComplianceDetails = this.complianceForm.value;
      
      this.onboardingService.submitComplianceDetails(complianceDetails, this.onboardingToken).subscribe({
        next: () => {
          this.isLoading = false;
          this.showSuccessMessage('Compliance details saved successfully!');
          this.moveToNextStep();
        },
        error: (error) => {
          this.isLoading = false;
          this.showErrorMessage('Failed to save compliance details');
        }
      });
    } else {
      this.markFormGroupTouched(this.complianceForm);
    }
  }

  submitFinalOnboarding(): void {
    this.isLoading = true;
    
    this.onboardingService.submitFinal(this.onboardingToken).subscribe({
      next: (response) => {
        this.isLoading = false;
        localStorage.removeItem('onboarding_token');
        localStorage.removeItem('vendor_id');
        
        this.snackBar.open('Onboarding completed successfully! Thank you for joining us.', 'Close', {
          duration: 10000,
          panelClass: ['success-snackbar']
        });
        
        // Redirect to a success/thank you page
        this.router.navigate(['/vendor/success']);
      },
      error: (error) => {
        this.isLoading = false;
        this.showErrorMessage('Failed to complete onboarding');
      }
    });
  }

  moveToNextStep(): void {
    if (this.stepper) {
      this.stepper.next();
      this.currentStep = this.stepper.selectedIndex;
    }
  }

  onFileSelected(event: any, formControlName: string): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Handle file upload logic here
      console.log('Files selected:', files);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control?.markAsTouched();
      }
    });
  }

  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}