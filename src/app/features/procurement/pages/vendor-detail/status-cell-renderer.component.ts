import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-status-cell-renderer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [ngClass]="getStatusClass()" class="status-chip">
      {{getDisplayValue()}}
    </span>
  `,
  styles: [`
    .status-chip {
      font-size: 11px;
      font-weight: 500;
      padding: 4px 8px;
      border-radius: 12px;
      color: white;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      
      &.requested { background-color: #2196f3; }
      &.validated { background-color: #4caf50; }
      &.pending { background-color: #ff9800; }
      &.denied { background-color: #f44336; }
    }
  `]
})
export class StatusCellRendererComponent implements ICellRendererAngularComp {
  params!: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }

  getDisplayValue(): string {
    return this.params.value || '';
  }

  getStatusClass(): string {
    const status = this.params.value?.toLowerCase();
    return status || 'requested';
  }
}