import { Component, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { CustomerService } from '../../services/customer/customer.service';

@Component({
  selector: 'app-credit',
  standalone: false,
  templateUrl: './credit.component.html',
  styleUrl: './credit.component.scss'
})
export class CreditComponent implements OnInit {
  selectedType: string = 'credit';  // Default selection
  rowData: any[] = [];
  creditData: any[] = [];
  debitData: any[] = [];

  columnDefs: ColDef[] = [
    { headerName: 'Document No', field: 'vbeln' },
    { headerName: 'Doc Type', field: 'fkart' },
    { headerName: 'Bill Date', field: 'fkdat' },
    {
      headerName: 'Net Amount',
      field: 'netwr',
      valueFormatter: (params) => this.formatCurrency(params.value, params.data?.waerk)
    },
    { headerName: 'Item No', field: 'posnr' },
    { headerName: 'Material No', field: 'matnr' },
    { headerName: 'Pricing Ref', field: 'knumv' },
    { headerName: 'Entry Date', field: 'erdat' },
    { headerName: 'Sales Org', field: 'vkorg' }
  ];

  defaultColDef: ColDef = {
    flex: 1,
    resizable: true,
    sortable: true,
    filter: true,
    headerClass: 'custom-header'
  };

  constructor(private cuService: CustomerService) {}  // Kept as cuService

  ngOnInit() {
    this.fetchCustomerCandD();
  }

  fetchCustomerCandD(): void {
    console.log('Fetching Customer Credit & Debit data...');
    this.cuService.getCustomerCandD().subscribe({
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
    this.updateTable();
  }

  updateTable() {
    this.rowData = this.selectedType === 'credit' ? this.creditData : this.debitData;
  }

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
    };

    const symbol = currencySymbols[currencyCode.toUpperCase()] || currencyCode + ' ';
    return `${symbol}${amount.toFixed(2)}`;
  }
}
