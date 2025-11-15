import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridReadyEvent, GridApi, ColumnApi } from 'ag-grid-community';
import { SharedModule } from '../../../../shared/shared.module';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { VendorService, Vendor, VendorListParams, ActivityTimeline } from '../../../../core/services/vendor.service';
import { StatusCellRendererComponent } from './status-cell-renderer.component';
import { ActionCellRendererComponent } from './action-cell-renderer.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-vendor-detail',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    PageHeaderComponent,
    AgGridModule,
    StatusCellRendererComponent,
    ActionCellRendererComponent
  ],
  templateUrl: './vendor-detail.component.html',
  styleUrls: ['./vendor-detail.component.scss']
})
export class VendorDetailComponent implements OnInit {
  selectedVendor: Vendor | null = null;
  vendors: Vendor[] = [];
  timeline: ActivityTimeline[] = [];
  isLoadingVendors = true;
  isLoadingTimeline = false;
  gridApi!: GridApi;
  gridColumnApi!: ColumnApi;
  
  // Vendor List Grid Configuration
  vendorColumnDefs: ColDef[] = [
    {
      headerName: 'Name',
      field: 'name',
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Email',
      field: 'email',
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 200
    },
    {
      headerName: 'Category',
      field: 'category',
      sortable: true,
      filter: true,
      width: 150
    },
    {
      headerName: 'Status',
      field: 'status',
      cellRenderer: StatusCellRendererComponent,
      sortable: true,
      filter: true,
      width: 120
    },
    {
      headerName: 'Created Date',
      field: 'createdDate',
      sortable: true,
      filter: 'agDateColumnFilter',
      valueFormatter: (params) => {
        if (params.value) {
          return new Date(params.value).toLocaleDateString();
        }
        return '';
      },
      width: 150
    },
    {
      headerName: 'Actions',
      cellRenderer: ActionCellRendererComponent,
      cellRendererParams: {
        onView: (vendor: Vendor) => this.viewVendorDetails(vendor),
        onFollowup: (vendor: Vendor) => this.sendFollowup(vendor)
      },
      width: 150,
      sortable: false,
      filter: false
    }
  ];
  
  // Timeline Grid Configuration
  timelineColumnDefs: ColDef[] = [
    {
      headerName: 'Date',
      field: 'date',
      sortable: true,
      valueFormatter: (params) => {
        if (params.value) {
          return new Date(params.value).toLocaleString();
        }
        return '';
      },
      width: 160
    },
    {
      headerName: 'Type',
      field: 'type',
      cellRenderer: (params: any) => {
        const icons: { [key: string]: string } = {
          'email': 'email',
          'submission': 'upload_file',
          'activity': 'timeline',
          'followup': 'send'
        };
        const icon = icons[params.value] || 'info';
        return `<mat-icon class="timeline-icon ${params.value}">${icon}</mat-icon>`;
      },
      width: 80
    },
    {
      headerName: 'Title',
      field: 'title',
      flex: 1,
      minWidth: 200
    },
    {
      headerName: 'Description',
      field: 'description',
      flex: 2,
      minWidth: 300,
      wrapText: true,
      autoHeight: true
    },
    {
      headerName: 'Status',
      field: 'status',
      cellRenderer: (params: any) => {
        if (params.value) {
          return `<span class="status-chip ${params.value}">${params.value}</span>`;
        }
        return '';
      },
      width: 100
    }
  ];
  
  defaultColDef: ColDef = {
    resizable: true,
    sortable: true
  };

  constructor(
    private vendorService: VendorService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadVendors();
    
    // Check if specific vendor ID is requested
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.loadVendorById(params['id']);
      }
    });
  }

  onGridReady(event: GridReadyEvent): void {
    this.gridApi = event.api;
    this.gridColumnApi = event.columnApi;
    this.gridApi.sizeColumnsToFit();
  }

  loadVendors(): void {
    this.isLoadingVendors = true;
    
    const params: VendorListParams = {
      page: 0,
      size: 100
    };
    
    this.vendorService.getVendorList(params).subscribe({
      next: (response) => {
        this.vendors = response.vendors;
        this.isLoadingVendors = false;
      },
      error: (error) => {
        console.error('Error loading vendors:', error);
        this.isLoadingVendors = false;
        this.snackBar.open('Failed to load vendors', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  loadVendorById(vendorId: string): void {
    this.vendorService.getVendorDetails(vendorId).subscribe({
      next: (vendor) => {
        this.selectedVendor = vendor;
        this.loadTimeline(vendorId);
      },
      error: (error) => {
        console.error('Error loading vendor details:', error);
        this.snackBar.open('Failed to load vendor details', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  loadTimeline(vendorId: string): void {
    this.isLoadingTimeline = true;
    
    this.vendorService.getVendorTimeline(vendorId).subscribe({
      next: (timeline) => {
        this.timeline = timeline;
        this.isLoadingTimeline = false;
      },
      error: (error) => {
        console.error('Error loading vendor timeline:', error);
        this.isLoadingTimeline = false;
      }
    });
  }

  viewVendorDetails(vendor: Vendor): void {
    this.selectedVendor = vendor;
    this.loadTimeline(vendor.id);
  }

  sendFollowup(vendor: Vendor): void {
    const message = `Follow-up for vendor: ${vendor.name}`;
    
    this.vendorService.sendManualFollowup(vendor.id, message).subscribe({
      next: () => {
        this.snackBar.open('Follow-up sent successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.loadTimeline(vendor.id);
      },
      error: (error) => {
        console.error('Error sending follow-up:', error);
        this.snackBar.open('Failed to send follow-up', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  downloadVendorPdf(vendor: Vendor): void {
    this.vendorService.downloadVendorPdf(vendor.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${vendor.name}_details.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error downloading PDF:', error);
        this.snackBar.open('Failed to download PDF', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  backToList(): void {
    this.selectedVendor = null;
    this.timeline = [];
  }

  getObjectEntries(obj: any): {key: string, value: any}[] {
    if (!obj) return [];
    return Object.entries(obj).map(([key, value]) => ({
      key: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
      value: value
    }));
  }
}