import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Vendor {
  id: string;
  name: string;
  email: string;
  category: string;
  status: 'requested' | 'validated' | 'pending' | 'denied';
  createdDate: Date;
  businessDetails?: any;
  contactDetails?: any;
  bankingDetails?: any;
  complianceDetails?: any;
}

export interface VendorRequest {
  name: string;
  email: string;
  category: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

export interface DashboardStats {
  requested: number;
  validated: number;
  pending: number;
  denied: number;
}

export interface VendorListParams {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
  category?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface ActivityTimeline {
  id: string;
  type: 'email' | 'submission' | 'activity' | 'followup';
  title: string;
  description: string;
  date: Date;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  private apiUrl = '/api/vendor';

  constructor(private http: HttpClient) {}

  createVendorRequest(request: VendorRequest): Observable<Vendor> {
    return this.http.post<Vendor>(`${this.apiUrl}/request`, request);
  }

  getVendorList(params: VendorListParams = {}): Observable<{vendors: Vendor[], total: number}> {
    // Mock vendors data for demo
    const mockVendors: Vendor[] = [
      {
        id: '1',
        name: 'TechCorp Solutions',
        email: 'contact@techcorp.com',
        category: 'technology',
        status: 'validated',
        createdDate: new Date('2024-11-01')
      },
      {
        id: '2',
        name: 'Global Supply Chain Inc.',
        email: 'info@globalsupply.com',
        category: 'logistics',
        status: 'pending',
        createdDate: new Date('2024-11-05')
      },
      {
        id: '3',
        name: 'Manufacturing Plus',
        email: 'sales@mfgplus.com',
        category: 'manufacturing',
        status: 'requested',
        createdDate: new Date('2024-11-10')
      },
      {
        id: '4',
        name: 'Consulting Experts LLC',
        email: 'hello@consultingexperts.com',
        category: 'consulting',
        status: 'denied',
        createdDate: new Date('2024-10-28')
      }
    ];
    
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({ vendors: mockVendors, total: mockVendors.length });
        observer.complete();
      }, 500);
    });
  }

  getVendorDetails(vendorId: string): Observable<Vendor> {
    return this.http.get<Vendor>(`${this.apiUrl}/${vendorId}`);
  }

  sendManualFollowup(vendorId: string, message: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${vendorId}/followup`, { message });
  }

  getDashboardStats(): Observable<DashboardStats> {
    // Mock data for demo
    const mockStats: DashboardStats = {
      requested: 12,
      validated: 8,
      pending: 5,
      denied: 2
    };
    
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(mockStats);
        observer.complete();
      }, 500);
    });
  }

  getVendorTimeline(vendorId: string): Observable<ActivityTimeline[]> {
    const mockTimeline: ActivityTimeline[] = [
      {
        id: '1',
        type: 'submission',
        title: 'Application Submitted',
        description: 'Vendor completed initial onboarding form',
        date: new Date('2024-11-01T10:00:00'),
        status: 'completed'
      },
      {
        id: '2',
        type: 'email',
        title: 'Welcome Email Sent',
        description: 'Automated welcome email sent to vendor',
        date: new Date('2024-11-01T10:05:00'),
        status: 'completed'
      },
      {
        id: '3',
        type: 'activity',
        title: 'Document Review',
        description: 'Compliance team reviewed submitted documents',
        date: new Date('2024-11-02T14:30:00'),
        status: 'completed'
      },
      {
        id: '4',
        type: 'followup',
        title: 'Follow-up Required',
        description: 'Additional certification documents requested',
        date: new Date('2024-11-03T09:15:00'),
        status: 'pending'
      }
    ];
    
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(mockTimeline);
        observer.complete();
      }, 500);
    });
  }

  downloadVendorPdf(vendorId: string): Observable<Blob> {
    // Mock PDF download
    const mockPdfContent = 'Mock PDF content for vendor ' + vendorId;
    const blob = new Blob([mockPdfContent], { type: 'application/pdf' });
    
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(blob);
        observer.complete();
      }, 1000);
    });
  }
}