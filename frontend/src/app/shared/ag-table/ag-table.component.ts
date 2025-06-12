import { Component, Input } from '@angular/core';
import { ColDef } from 'ag-grid-community';
@Component({
  selector: 'app-ag-table',
  standalone:false,
 template: `
    <div class="page-container">
      <h2>{{ title }}</h2>
      <div class="page-header">
        <ng-content select="[header]"></ng-content> <!-- Custom header actions -->
      </div>
      <div class="page-content">
        <ng-content select="[content]"></ng-content> <!-- Additional page content -->
      </div>
      <app-ag-table
        [rowData]="rowData"
        [columnDefs]="columnDefs"
        [defaultColDef]="defaultColDef"
        [rowSelection]="rowSelection"
        [gridOptions]="gridOptions">
      </app-ag-table>
    </div>
  `,
  styles: [`
    .page-container { padding: 20px; }
    .page-header { margin-bottom: 10px; }
    .page-content { margin-bottom: 20px; }
  `]
})
export class AgTableComponent {
 @Input() title: string = 'Page';
  @Input() rowData: any[] = [];
  @Input() columnDefs: ColDef[] = [];
  @Input() defaultColDef: ColDef = {};
  @Input() rowSelection: string = 'single';
  @Input() gridOptions: any = {};
}

