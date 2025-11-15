import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { VendorOtpComponent } from './pages/otp/vendor-otp.component';
import { OnboardingWizardComponent } from './pages/onboarding-wizard/onboarding-wizard.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'otp',
    pathMatch: 'full'
  },
  {
    path: 'otp',
    component: VendorOtpComponent
  },
  {
    path: 'onboarding',
    component: OnboardingWizardComponent
  },
  {
    path: 'success',
    loadComponent: () => import('./pages/success/success.component').then(m => m.SuccessComponent)
  }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class VendorModule { }