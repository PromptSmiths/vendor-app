import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { SharedModule } from '../../shared/shared.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { VendorRequestComponent } from './pages/vendor-request/vendor-request.component';
import { VendorDetailComponent } from './pages/vendor-detail/vendor-detail.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'vendor-request',
    component: VendorRequestComponent
  },
  {
    path: 'vendor-detail',
    component: VendorDetailComponent
  },
  {
    path: 'vendor-list',
    component: VendorDetailComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AgGridModule,
    RouterModule.forChild(routes)
  ]
})
export class ProcurementModule { }