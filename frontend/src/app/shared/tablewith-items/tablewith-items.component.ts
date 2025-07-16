import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ColDef, CellClickedEvent } from 'ag-grid-community';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-tablewith-items',
  standalone: false,
  templateUrl: './tablewith-items.component.html',
  styleUrls: ['./tablewith-items.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TablewithItemsComponent implements OnInit {
  @Input() rowData: any[] = [];
  @Input() itemColumnDefs: ColDef[] = [];

  private _columnDefs: ColDef[] = [];

  @Input() set columnDefs(value: ColDef[]) {
    this._columnDefs = value || [];
  }

  get columnDefs(): ColDef[] {
    return this._columnDefs;
  }

  @Input() defaultColDef: ColDef = {
    flex: 1,
    resizable: true,
    sortable: true,
    filter: true,
    headerClass: 'custom-header'
  };

  @Input() popupTitle: string = 'test title';
  @Input() enableItemPopup: boolean = true;
  @Input() enableDownload: boolean = false;
  @Input() showTitle:boolean = true;
  @Output() downloadClicked = new EventEmitter<void>();
  @Output() rowSelected = new EventEmitter<any>();

  selectedRow: any = null;
  selectedItems: any[] = [];
  showDetailPopup: boolean = false;
  showGif: boolean = false;

  ngOnInit(): void {
    if (this.enableItemPopup) {
      this._appendMoreDetailsColumn();
    }
  }

  private _appendMoreDetailsColumn(): void {
    const moreDetailsCol: ColDef = {
      headerName: 'More Details',
      field: 'view',
      width: 160,
      cellRenderer: () =>
        `<div style="display: flex; align-items: center; justify-content: flex-start; gap: 6px; cursor: pointer;">
           <span class="material-icons view-icon" title="View Items">visibility</span>
           <span style="font-size: 13px;">More Details</span>
         </div>`,
      menuTabs: [],
      sortable: false,
      filter: false,
      cellStyle: { paddingLeft: '8px' }
    };

    if (!this._columnDefs.find(col => col.headerName === 'More Details')) {
      this._columnDefs.push(moreDetailsCol);
    }
  }

  onRowClicked(event: CellClickedEvent): void {
    if (!this.enableItemPopup || event.colDef.headerName !== 'More Details') return;

    this.selectedRow = event.data;
    this.selectedItems = event.data?.items || [];
    this.showDetailPopup = true;
    this.rowSelected.emit(this.selectedRow);
  }

  closeDetailPopup(): void {
    this.showDetailPopup = false;
  }

  toggleGif(): void {
    this.showGif = !this.showGif;
  }

  formatTitle(str: string): string {
    return str.replace(/ies$/, 'y').replace(/s$/, '');
  }

  triggerDownload(): void {
    this.downloadClicked.emit();
  }
}
