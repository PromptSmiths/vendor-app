import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../../shared/shared.module';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  template: `
    <div class="success-container">
      <div class="success-card">
        <mat-card>
          <mat-card-content class="success-content">
            <div class="success-icon">
              <mat-icon>check_circle</mat-icon>
            </div>
            <h1>Onboarding Complete!</h1>
            <p class="success-message">
              Thank you for completing your vendor onboarding. Your application has been submitted successfully and is now under review.
            </p>
            <p class="next-steps">
              <strong>What happens next?</strong><br>
              Our procurement team will review your application within 2-3 business days. You will receive an email notification with the approval status and next steps.
            </p>
            <div class="contact-info">
              <p>If you have any questions, please contact our procurement team at:</p>
              <p><strong>Email:</strong> procurement&#64;company.com</p>
              <p><strong>Phone:</strong> +1 (555) 123-4567</p>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .success-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }
    
    .success-card {
      width: 100%;
      max-width: 600px;
    }
    
    .success-content {
      text-align: center;
      padding: 48px 32px;
    }
    
    .success-icon {
      margin-bottom: 24px;
      
      mat-icon {
        color: #4caf50;
        font-size: 80px;
        width: 80px;
        height: 80px;
      }
    }
    
    h1 {
      font-size: 32px;
      font-weight: 600;
      color: #333;
      margin-bottom: 16px;
    }
    
    .success-message {
      font-size: 16px;
      color: #666;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    
    .next-steps {
      background: #e8f5e8;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #4caf50;
      text-align: left;
      margin-bottom: 24px;
      
      strong {
        color: #2e7d32;
      }
    }
    
    .contact-info {
      background: #f5f5f5;
      padding: 20px;
      border-radius: 8px;
      text-align: left;
      
      p {
        margin: 8px 0;
        color: #666;
        
        &:first-child {
          font-weight: 500;
          color: #333;
        }
        
        strong {
          color: #333;
        }
      }
    }
    
    @media (max-width: 768px) {
      .success-content {
        padding: 32px 24px;
      }
      
      h1 {
        font-size: 24px;
      }
      
      .success-icon mat-icon {
        font-size: 60px;
        width: 60px;
        height: 60px;
      }
    }
  `]
})
export class SuccessComponent { }