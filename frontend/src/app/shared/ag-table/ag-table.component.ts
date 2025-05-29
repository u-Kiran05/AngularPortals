import { Component, Input } from '@angular/core';
import { ColDef } from 'ag-grid-community';
@Component({
  selector: 'app-ag-table',
  standalone:false,
  templateUrl: './ag-table.component.html',
  styleUrl: './ag-table.component.scss'
})
export class AgTableComponent {
  @Input() rowData: any[] = [];
  @Input() columnDefs: ColDef[] = [];
  @Input() defaultColDef: ColDef = {
    flex: 1,
    resizable: true,
    sortable: true,
    filter: true,
    headerClass: 'custom-header'
  };
}

