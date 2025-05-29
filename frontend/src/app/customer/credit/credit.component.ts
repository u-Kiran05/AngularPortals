import { Component, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';

import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-credit',
  standalone:false,
  templateUrl: './credit.component.html',
  styleUrl: './credit.component.scss'
})
export class CreditComponent implements OnInit {
  selectedType: string = 'credit';  // Default selection
  rowData: any[] = [];
  columnDefs: ColDef[] = [
    { headerName: 'Document No', field: 'vbeln' },
    { headerName: 'Doc Type', field: 'fkart' },
    //{ headerName: 'Category', field: 'fktyp' },
    { headerName: 'Bill Date', field: 'fkdat' },
   //{ headerName: 'Doc Kind', field: 'vbtyp' },
     {
      headerName: 'Net Amount',
      field: 'netwr',
      valueFormatter: (params) => this.formatCurrency(params.value, params.data?.waerk)
    },
   // { headerName: 'Currency', field: 'waerk' },
    { headerName: 'Item No', field: 'posnr' },
    { headerName: 'Material No', field: 'matnr' },
    { headerName: 'Pricing Ref', field: 'knumv' },
   // { headerName: 'Ref Doc', field: 'kidno' },
    //{ headerName: 'Entry Time', field: 'erzet' },
    { headerName: 'Entry Date', field: 'erdat' },
    { headerName: 'Sales Org', field: 'vkorg' }
  ];

  creditData: any[] = [];
  debitData: any[] = [];
  customerId: string = '';  // Set from input or user login

  constructor(private authService: AuthService) {}
   formatCurrency(amount: number, currencyCode: string): string {
    if (!amount || !currencyCode) {
      return amount?.toString() || '';
    }

    const currencySymbols: { [key: string]: string } = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'INR': '₹',
      'JPY': '¥',
      'CNY': '¥',
      'AUD': 'A$',
      'CAD': 'C$',
      // Add more currency codes and symbols as needed
    };

    const symbol = currencySymbols[currencyCode.toUpperCase()] || currencyCode + ' ';
    return `${symbol}${amount.toFixed(2)}`;
  }

  ngOnInit() {
    this.fetchCustomerCandD(this.customerId);
  }
  

  
  fetchCustomerCandD(customerId: string): void {
    console.log('Fetching Customer C&D for customerId:', customerId);
    this.authService.getCustomerCandD().subscribe({
      next: (res) => {
        console.log('Response received:', res);
        const data = res?.data ?? {};
        this.creditData = data.credit ?? [];
        this.debitData = data.debit ?? [];
        this.updateTable();
      },
      error: (err) => {
        console.error('Failed to load Customer C&D:', err);
        this.creditData = [];
        this.debitData = [];
        this.rowData = [];
      }
    });
  }
 
selectType(type: string) {
  this.selectedType = type;
  this.onTypeChange(); // Call your function if needed
}

  onTypeChange() {
    this.updateTable();
  }
  
  updateTable() {
    this.rowData = this.selectedType === 'credit' ? this.creditData : this.debitData;
  }
}
