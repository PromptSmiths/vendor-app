import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './core/components/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/procurement/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'procurement',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    loadChildren: () => import('./features/procurement/procurement.module').then(m => m.ProcurementModule)
  },
  {
    path: 'vendor',
    loadChildren: () => import('./features/vendor/vendor.module').then(m => m.VendorModule)
  },
  {
    path: '**',
    redirectTo: '/procurement/dashboard'
  }
];