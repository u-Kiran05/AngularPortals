import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-tablewith-items',
  standalone: false,
  templateUrl: './tablewith-items.component.html',
  styleUrls: ['./tablewith-items.component.scss'],
  encapsulation: ViewEncapsulation.None
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

  // Controls whether to show the item popup
  @Input() enableItemPopup: boolean = true;

  // Controls whether to show the download button inside the popup
  @Input() enableDownload: boolean = false;

  @Output() downloadClicked = new EventEmitter<void>();
@Output() rowSelected = new EventEmitter<any>();  // NEW


  selectedRow: any = null;
  selectedItems: any[] = [];
  showDetailPopup: boolean = false;
  showGif: boolean = false;

 onRowClicked(event: any) {
  if (!this.enableItemPopup) return;

  this.selectedItems = event.data.items;
  this.selectedRow = event.data;
  this.showDetailPopup = true;

  this.rowSelected.emit(this.selectedRow);  // NEW
}


  closeDetailPopup() {
    this.showDetailPopup = false;
  }

  toggleGif() {
    this.showGif = !this.showGif;
  }

  formatTitle(str: string): string {
    return str
      .replace(/ies$/, 'y')
      .replace(/s$/, '');
  }

  triggerDownload() {
    this.downloadClicked.emit();
  }
}
