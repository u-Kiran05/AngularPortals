import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-invoice',
  standalone: false,
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent {
  rowData: any[] = [];
  customerId: string = '';

  columnDefs: ColDef[] = [
    { headerName: 'Invoice No.', field: 'vbeln', filter: true, sortable: true },
    { headerName: 'Invoice Date', field: 'fkdat', filter: true, sortable: true },
    {
      headerName: 'Net Value',
      field: 'netwr',
      filter: true,
      sortable: true,
      valueFormatter: (params) => this.formatNetValue(params.value, params.data?.waerk)
    },
    //{ headerName: 'Currency', field: 'waerk', filter: true, sortable: true },
    { headerName: 'Pricing Procedure', field: 'knumv', filter: true, sortable: true },
    { headerName: 'Billing Type', field: 'fkart', filter: true, sortable: true },
    { headerName: 'Item No.', field: 'posnr', filter: true, sortable: true },
    { headerName: 'Material No.', field: 'matnr', filter: true, sortable: true },
    { headerName: 'Material Desc', field: 'arktx', filter: true, sortable: true },
    { headerName: 'Quantity', field: 'fkimg', filter: true, sortable: true },
    { headerName: 'Unit', field: 'vrkme', filter: true, sortable: true }
  ];

  defaultColDef: ColDef = {
    flex: 1,
    resizable: true
  };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.getUserInfo();
    if (user && user.id) {
      this.customerId = user.id;
      this.fetchCustomerInvoices(this.customerId);
    }
  }

  fetchCustomerInvoices(customerId: string): void {
    this.authService.getCustomerInvoices(customerId).subscribe({
      next: (res) => {
        this.rowData = res.data || [];
      },
      error: (err) => {
        console.error('Failed to load invoice data:', err);
      }
    });
  }

  private formatNetValue(value: any, currency: string): string {
    if (!value || !currency) return '';
    const currencySymbol = this.getCurrencySymbol(currency);
    const formattedValue = parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `${currencySymbol}${formattedValue}`;
  }

  private getCurrencySymbol(currency: string): string {
    switch (currency) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'INR': return '₹';
      case 'GBP': return '£';
      case 'JPY': return '¥';
      default: return currency + ' '; // fallback to currency code with a space
    }
  }
}
