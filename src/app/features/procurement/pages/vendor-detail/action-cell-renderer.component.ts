import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

interface ActionCellParams extends ICellRendererParams {
  onView: (vendor: any) => void;
  onFollowup: (vendor: any) => void;
}

@Component({
  selector: 'app-action-cell-renderer',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  template: `
    <div class="action-buttons">
      <button 
        mat-icon-button 
        color="primary"
        matTooltip="View Details"
        (click)="onView()">
        <mat-icon>visibility</mat-icon>
      </button>
      
      <button 
        mat-icon-button 
        color="accent"
        matTooltip="Send Follow-up"
        (click)="onFollowup()">
        <mat-icon>send</mat-icon>
      </button>
    </div>
  `,
  styles: [`
    .action-buttons {
      display: flex;
      gap: 4px;
      align-items: center;
      justify-content: center;
      
      button {
        width: 32px;
        height: 32px;
        
        mat-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
        }
      }
    }
  `]
})
export class ActionCellRendererComponent implements ICellRendererAngularComp {
  params!: ActionCellParams;

  agInit(params: ActionCellParams): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }

  onView(): void {
    if (this.params.onView) {
      this.params.onView(this.params.data);
    }
  }

  onFollowup(): void {
    if (this.params.onFollowup) {
      this.params.onFollowup(this.params.data);
    }
  }
}