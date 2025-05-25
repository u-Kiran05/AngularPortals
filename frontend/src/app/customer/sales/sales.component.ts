import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-sales',
  standalone: false,
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {
  rowData: any[] = [];
  customerId: string = '';

  columnDefs: ColDef[] = [
  { headerName: 'Sales Order No', field: 'salesOrderNo', headerClass: 'custom-header', filter: true, sortable: true },
  { headerName: 'Document Type', field: 'docType', headerClass: 'custom-header', filter: true, sortable: true },
  { headerName: 'Order Date', field: 'orderDate', headerClass: 'custom-header', filter: true, sortable: true },
  { headerName: 'Sales Org', field: 'salesOrgName', headerClass: 'custom-header', filter: true, sortable: true },
  { headerName: 'Dist. Channel', field: 'distChannel', headerClass: 'custom-header', filter: true, sortable: true },
  { headerName: 'Division', field: 'division', headerClass: 'custom-header', filter: true, sortable: true },
  { headerName: 'Material No', field: 'materialNo', headerClass: 'custom-header', filter: true, sortable: true },
  { headerName: 'Description', field: 'description', headerClass: 'custom-header', filter: true, sortable: true },
  {
    headerName: 'Net Value',
    field: 'netValue',
    headerClass: 'custom-header',
    filter: true,
    sortable: true,
    valueFormatter: formatNetValue
  }
  // { headerName: 'Currency', field: 'currency', headerClass: 'custom-header', filter: true, sortable: true }
];


  defaultColDef: ColDef = {
    flex: 1,
    resizable: true
  };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.getUserInfo();
    if (user?.id) {
      this.customerId = user.id;
      this.fetchCustomerSales(this.customerId);
    }
  }

  fetchCustomerSales(customerId: string): void {
    this.authService.getCustomerSales(customerId).subscribe({
      next: (res) => {
        this.rowData = res.data || [];
      },
      error: (err) => {
        console.error('Failed to load sales data:', err);
      }
    });
  }
}

// 💡 Helper to format net value with currency symbol and locale formatting
function formatNetValue(params: any): string {
  const currency = params.data?.currency;
  const value = parseFloat(params.value);
  let symbol = '';

  switch (currency) {
    case 'USD': symbol = '$'; break;
    case 'EUR': symbol = '€'; break;
    case 'INR': symbol = '₹'; break;
    case 'GBP': symbol = '£'; break;
    default: symbol = currency + ' ';
  }

  return `${symbol}${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}
