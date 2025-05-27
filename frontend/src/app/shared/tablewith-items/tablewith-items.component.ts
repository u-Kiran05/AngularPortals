import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ColDef } from 'ag-grid-community';
@Component({
  selector: 'app-tablewith-items',
  standalone:false,
  templateUrl: './tablewith-items.component.html',
  styleUrl: './tablewith-items.component.scss'
})
export class TablewithItemsComponent {
  @Input() rowData: any[] = [];
  @Input() columnDefs: ColDef[] = [];
  @Input() itemColumnDefs: ColDef[] = [];
  @Input() defaultColDef: ColDef = {
    flex: 1,
    resizable: true,
    sortable: true,
    filter: true,
    headerClass: 'custom-header'
  };

    @Input() popupTitle: string = 'Items';

  selectedRow: any = null;
  selectedItems: any[] = [];
  showDetailPopup: boolean = false;

  onRowClicked(event: any) {
    this.selectedItems = event.data.items;
    this.selectedRow = event.data;  // Capture the entire selected row
    this.showDetailPopup = true;
  }

  closeDetailPopup() {
    this.showDetailPopup = false;
  }
}