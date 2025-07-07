import { Component, OnInit } from '@angular/core';
import { VendorService } from '../../services/vendor/vendor.service';
import { ColDef } from 'ag-grid-community';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-vaging',
  standalone: false,
  templateUrl: './vaging.component.html',
  styleUrl: './vaging.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class VagingComponent implements OnInit {
  rowData: any[] = [];

  agingColumnDefs: ColDef[] = [
    { headerName: 'Document No', field: 'belnr' },
    { headerName: 'Fiscal Year', field: 'gjahr' },
    { headerName: 'Billing Date', field: 'budat' },
    { headerName: 'Due Date', field: 'zfbdt' },
    { headerName: 'Gross Amount', field: 'wrbtr' },
    { headerName: 'Tax Amount', field: 'wmwst' },
    { headerName: 'Net Amount', field: 'netAmount' },

    { headerName: 'Currency', field: 'waers' },
        { headerName: 'Days Aging', field: 'daysAging' }
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
    this.fetchVendorAging();
  }

  fetchVendorAging(): void {
    this.veService.getVendorAging().subscribe({
      next: (agingList: any[]) => {
        this.rowData = agingList;
      },
      error: (err) => {
        console.error('[Vaging] Failed to load vendor aging data:', err);
      }
    });
  }
}
