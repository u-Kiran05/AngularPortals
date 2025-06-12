import { Component, OnInit } from '@angular/core';
import { VendorService } from '../../services/vendor/vendor.service';
import { ColDef } from 'ag-grid-community';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-vgoods',
  standalone: false,
  templateUrl: './vgoods.component.html',
  styleUrl: './vgoods.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class VgoodsComponent implements OnInit {
  rowData: any[] = [];
  

  grColumnDefs: ColDef[] = [
    { headerName: 'GR Number', field: 'mblnr' },
   // { headerName: 'GR Year', field: 'mjahr' },
    { headerName: 'PO Number', field: 'ebeln' },
    { headerName: 'PO Item', field: 'ebelp' },
    { headerName: 'Material No', field: 'matnr' },
    { headerName: 'Quantity', field: 'menge' },
    { headerName: 'Unit', field: 'meins' },
    { headerName: 'Plant', field: 'werks' },
    { headerName: 'Posting Date', field: 'budat' },
 //   { headerName: 'Currency', field: 'waers' },
  //  { headerName: 'Movement Type', field: 'bwart' }
  ];

  defaultColDef: ColDef = {
    flex: 1,
    resizable: true,
    sortable: true,
    filter: true,
    headerClass: 'custom-header'
  };

  constructor(private veService: VendorService) {}

  ngOnInit(): void {
    this.fetchVendorGRs();
  }

  fetchVendorGRs(): void {
    this.veService.getVendorGoodsReceipts().subscribe({
      next: (grList: any[]) => {
        this.rowData = grList;
      },
      error: (err) => {
        console.error('[Vgoods] Failed to load vendor GRs:', err);
      }
    });
  }
}
