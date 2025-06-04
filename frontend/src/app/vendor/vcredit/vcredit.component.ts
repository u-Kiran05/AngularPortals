import { Component, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { VendorService } from '../../services/vendor/vendor.service';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-vcredit',
 standalone:false,
  templateUrl: './vcredit.component.html',
  styleUrl: './vcredit.component.scss',
     encapsulation: ViewEncapsulation.None
})
export class VcreditComponent {
 selectedType: string = 'credit';
  rowData: any[] = [];
  creditData: any[] = [];
  debitData: any[] = [];

  columnDefs: ColDef[] = [
    { headerName: 'Document No', field: 'belnr' },
    { headerName: 'Company Code', field: 'bukrs' },
    { headerName: 'Fiscal Year', field: 'gjahr' },
    { headerName: 'Posting Date', field: 'budat' },
   // { headerName: 'Doc Date', field: 'bldat' },
    //{ headerName: 'Doc Type', field: 'blart' },
    {
      headerName: 'Amount',
      field: 'wrbtr',
      valueFormatter: (params) => this.formatCurrency(params.value, params.data?.waers)
    },
    { headerName: 'Currency', field: 'waers' }
  ];

  constructor(private vendorService: VendorService) {}

  ngOnInit() {
    this.loadVendorCandD();
  }

  loadVendorCandD() {
    this.vendorService.getVendorCreditDebit().subscribe({
      next: (res) => {
        this.creditData = res.credit || [];
        this.debitData = res.debit || [];
        this.updateTable();
      },
      error: (err) => {
        console.error('Error loading vendor credit/debit data:', err);
        this.rowData = [];
      }
    });
  }

  selectType(type: string) {
    this.selectedType = type;
    this.updateTable();
  }

  updateTable() {
    this.rowData = this.selectedType === 'credit' ? this.creditData : this.debitData;
  }
formatCurrency(amount: any, currencyCode: string): string {
  const num = parseFloat(amount);  // Convert to number safely
  if (isNaN(num) || !currencyCode) return amount?.toString() || '';
  
  const symbols: any = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };
  const symbol = symbols[currencyCode.toUpperCase()] || currencyCode + ' ';
  return `${symbol}${num.toFixed(2)}`;
}


}