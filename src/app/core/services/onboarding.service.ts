import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OtpRequest {
  email: string;
}

export interface OtpVerification {
  email: string;
  otp: string;
}

export interface OnboardingState {
  currentStep: number;
  completedSteps: number[];
  vendorId: string;
  token: string;
}

export interface BusinessDetails {
  companyName: string;
  businessType: string;
  taxId: string;
  registrationNumber: string;
  website?: string;
  description: string;
  establishedYear: number;
  employees: number;
  documents?: File[];
}

export interface ContactDetails {
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactPhone: string;
  secondaryContactName?: string;
  secondaryContactEmail?: string;
  secondaryContactPhone?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface BankingDetails {
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  accountType: 'checking' | 'savings';
  bankAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  documents?: File[];
}

export interface ComplianceDetails {
  certifications: string[];
  insuranceDetails: {
    provider: string;
    policyNumber: string;
    coverage: string;
    expiryDate: Date;
  };
  qualityStandards: string[];
  documents?: File[];
}

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {
  private apiUrl = '/api/onboarding';

  constructor(private http: HttpClient) {}

  sendOtp(request: OtpRequest): Observable<{ message: string }> {
    // Mock OTP sending
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({ message: 'OTP sent successfully' });
        observer.complete();
      }, 1000);
    });
  }

  verifyOtp(verification: OtpVerification): Observable<OnboardingState> {
    // Mock OTP verification - accept any 6-digit code
    if (verification.otp.length === 6) {
      const mockState: OnboardingState = {
        currentStep: 0,
        completedSteps: [],
        vendorId: 'mock-vendor-id',
        token: 'mock-onboarding-token-' + Date.now()
      };
      
      return new Observable(observer => {
        setTimeout(() => {
          observer.next(mockState);
          observer.complete();
        }, 1000);
      });
    } else {
      return new Observable(observer => {
        setTimeout(() => {
          observer.error({ error: { message: 'Invalid OTP' } });
        }, 1000);
      });
    }
  }

  getOnboardingState(token: string): Observable<OnboardingState> {
    const mockState: OnboardingState = {
      currentStep: 0,
      completedSteps: [],
      vendorId: 'mock-vendor-id',
      token: token
    };
    
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(mockState);
        observer.complete();
      }, 500);
    });
  }

  submitBusinessDetails(details: BusinessDetails, token: string): Observable<{ success: boolean }> {
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({ success: true });
        observer.complete();
      }, 1000);
    });
  }

  submitContactDetails(details: ContactDetails, token: string): Observable<{ success: boolean }> {
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({ success: true });
        observer.complete();
      }, 1000);
    });
  }

  submitBankingDetails(details: BankingDetails, token: string): Observable<{ success: boolean }> {
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({ success: true });
        observer.complete();
      }, 1000);
    });
  }

  submitComplianceDetails(details: ComplianceDetails, token: string): Observable<{ success: boolean }> {
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({ success: true });
        observer.complete();
      }, 1000);
    });
  }

  submitFinal(token: string): Observable<{ success: boolean, message: string }> {
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({ 
          success: true, 
          message: 'Onboarding completed successfully!' 
        });
        observer.complete();
      }, 2000);
    });
  }

  private createFormData(data: any): FormData {
    const formData = new FormData();
    
    Object.keys(data).forEach(key => {
      if (key === 'documents' && data[key]) {
        data[key].forEach((file: File, index: number) => {
          formData.append(`documents[${index}]`, file);
        });
      } else if (typeof data[key] === 'object' && data[key] !== null) {
        formData.append(key, JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key]);
      }
    });
    
    return formData;
  }
}