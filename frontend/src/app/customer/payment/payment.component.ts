import { Component, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-payment',
  standalone:false,
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
  
})
export class PaymentComponent {

  rowData: any[] = [];
  customerId: string = '';

 agingColumnDefs: ColDef[] = [
  { headerName: 'Document No', field: 'vbeln' },
  { headerName: 'Bill Date', field: 'fkdat' },
  { headerName: 'Due Date', field: 'dueDate' },
  { 
    headerName: 'Net Amount', 
    field: 'netwr',
    valueFormatter: (params) => {
      const value = params.value;
      const currencyCode = params.data?.waerk || 'INR'; // Fallback to USD
      if (value != null) {
        // Map of common currency codes to symbols
        const currencySymbols: { [code: string]: string } = {
          USD: '$', INR: '₹', EUR: '€', GBP: '£', JPY: '¥', AUD: 'A$', CAD: 'C$', CHF: 'CHF', CNY: '¥', KRW: '₩'
        };
        const symbol = currencySymbols[currencyCode.toUpperCase()] || currencyCode; // Fallback to code
        const formattedValue = new Intl.NumberFormat(undefined, { 
          minimumFractionDigits: 2, maximumFractionDigits: 2 
        }).format(value);
        return `${symbol} ${formattedValue}`; 
      }
      return value;
    }
  },
  { headerName: 'Currency', field: 'waerk' },
  { headerName: 'Aging (Days)', field: 'aging' }
];
  defaultColDef: ColDef = {
    flex: 1,
    resizable: true,
    sortable: true,
    filter: true,
    headerClass: 'custom-header',
  };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.getUserInfo();
    if (user?.id) {
      this.customerId = user.id;
      this.fetchCustomerAging(this.customerId);
    }
  }

  fetchCustomerAging(customerId: string): void {
    console.log('Fetching Customer Aging for customerId:', customerId);
    this.authService.getCustomerAging().subscribe({
      next: (res) => {
        console.log('Aging response received:', res);
        this.rowData = res?.data ?? [];
      },
      error: (err) => {
        console.error('Failed to load Customer Aging data:', err);
        this.rowData = [];
      }
    });
  }
}