import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SharedModule } from '../../../../shared/shared.module';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { VendorService, DashboardStats } from '../../../../core/services/vendor.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    PageHeaderComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats$: Observable<DashboardStats>;
  isLoading = true;

  statsCards = [
    {
      title: 'Requested',
      icon: 'inbox',
      color: 'primary',
      route: '/procurement/vendor-list?status=requested'
    },
    {
      title: 'Validated',
      icon: 'verified',
      color: 'accent',
      route: '/procurement/vendor-list?status=validated'
    },
    {
      title: 'Pending',
      icon: 'pending',
      color: 'warn',
      route: '/procurement/vendor-list?status=pending'
    },
    {
      title: 'Denied',
      icon: 'cancel',
      color: 'basic',
      route: '/procurement/vendor-list?status=denied'
    }
  ];

  constructor(
    private vendorService: VendorService,
    private router: Router
  ) {
    this.stats$ = this.vendorService.getDashboardStats();
  }

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.stats$.subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
        this.isLoading = false;
      }
    });
  }

  navigateToVendorRequest(): void {
    this.router.navigate(['/procurement/vendor-request']);
  }

  navigateToVendorList(): void {
    this.router.navigate(['/procurement/vendor-detail']);
  }

  navigateToCard(route: string): void {
    this.router.navigateByUrl(route);
  }

  getStatValue(stats: DashboardStats | null, key: string): number {
    if (!stats) return 0;
    return (stats as any)[key] || 0;
  }
}