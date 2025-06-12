import { Component, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { CustomerService } from '../../services/customer/customer.service';  // Updated import

@Component({
  selector: 'app-payment',
  standalone: false,
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent implements OnInit {

  rowData: any[] = [];

  agingColumnDefs: ColDef[] = [
    { headerName: 'Document No', field: 'vbeln' },
    { headerName: 'Bill Date', field: 'fkdat' },
    { headerName: 'Due Date', field: 'dueDate' },
    { 
      headerName: 'Net Amount', 
      field: 'netwr',
      valueFormatter: (params) => {
        const value = params.value;
        const currencyCode = params.data?.waerk || 'INR';
        if (value != null) {
          const currencySymbols: { [code: string]: string } = {
            USD: '$', INR: '₹', EUR: '€', GBP: '£', JPY: '¥', AUD: 'A$', CAD: 'C$', CHF: 'CHF', CNY: '¥', KRW: '₩'
          };
          const symbol = currencySymbols[currencyCode.toUpperCase()] || currencyCode;
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
    headerClass: 'custom-header'
  };

  constructor(private cuService: CustomerService) {}  // Updated service

  ngOnInit(): void {
    this.fetchCustomerAging();
  }

  fetchCustomerAging(): void {
    console.log('Fetching Customer Aging data...');
    this.cuService.getCustomerAging().subscribe({
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
