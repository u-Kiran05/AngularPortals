import { Component, OnInit } from '@angular/core';
import { VendorService } from '../../services/vendor/vendor.service';
import { ColDef } from 'ag-grid-community';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-vquotation',
  standalone:false,
  templateUrl: './vquotation.component.html',
  styleUrl: './vquotation.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class VquotationComponent {
 rowData: any[] = [];
  showGif = false;

  rfqColumnDefs: ColDef[] = [
    { headerName: 'RFQ Number', field: 'ebeln' },
    { headerName: 'Company Code', field: 'bukrs' },
    { headerName: 'Created On', field: 'bedat' },
    { headerName: 'RFQ Type', field: 'bsart' },
    { headerName: 'Purch. Org', field: 'ekorg' },
    { headerName: 'Purch. Group', field: 'ekgrp' },
    { headerName: 'Currency', field: 'waers' }
  ];

  itemColumnDefs: ColDef[] = [
    { headerName: 'Item No', field: 'ebelp' },
    { headerName: 'Material No', field: 'matnr' },
    { headerName: 'UoM', field: 'meins' }
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
    this.fetchVendorRFQs();
  }

  fetchVendorRFQs(): void {
    this.veService.getVendorQuotations().subscribe({
      next: (rfqList: any[]) => {
        this.rowData = rfqList.map(rfq => ({
          ...rfq,
          items: rfq.items || []
        }));
      },
      error: (err) => {
        console.error('[Vrfq] Failed to load vendor RFQs:', err);
      }
    });
  }
}