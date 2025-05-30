import { Component, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-ovsales',
  standalone:false,
  templateUrl: './ovsales.component.html',
  styleUrl: './ovsales.component.scss'
})
export class OvsalesComponent implements OnInit {
 
  rowData: any[] = [];
  customerId: string = '';
  showInsights: boolean = false;

  // Chart data
  totalOrdersByRecordType: any[] = [];
  totalOrderValueByDate: any[] = [];
  totalBilledByDocType: any[] = [];
  orderValueDistribution: any[] = [];

  overallSalesColumnDefs: ColDef[] = [
    { headerName: 'Document No', field: 'documentNo' },
    { headerName: 'Doc Date', field: 'docDate' },
    { headerName: 'Record Type', field: 'recordType' },
    { headerName: 'Doc Type', field: 'docType' },
    { headerName: 'Sales Org', field: 'salesOrg' },
    { headerName: 'Customer ID', field: 'customerId' },
    { headerName: 'Total Orders', field: 'totalOrders' },
    {
      headerName: 'Order Value',
      field: 'totalOrderValue',
      valueFormatter: this.currencyFormatter
    },
    {
      headerName: 'Total Billed',
      field: 'totalBilled',
      valueFormatter: this.currencyFormatter
    },
    { headerName: 'Currency', field: 'currency' }
  ];

  defaultColDef: ColDef = {
    flex: 1,
    resizable: true,
    sortable: true,
    filter: true,
    headerClass: 'custom-header'
  };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.getUserInfo();
    if (user?.id) {
      this.customerId = user.id;
      this.fetchCustomerOverallSales(this.customerId);
    }
  }

  fetchCustomerOverallSales(customerId: string): void {
    this.authService.getCustomerOverallSales().subscribe({
      next: (res) => {
        this.rowData = res?.data ?? [];
        this.prepareInsights();
      },
      error: (err) => {
        console.error('Error loading data:', err);
        this.rowData = [];
      }
    });
  }

  prepareInsights(): void {
    const recordTypeMap = new Map();
    const dateMap = new Map();
    const docTypeMap = new Map();
    const orderValues = [];

    for (const entry of this.rowData) {
      const recordType = entry.recordType || 'UNKNOWN';
      const docDate = entry.docDate || 'UNKNOWN';
      const docType = entry.docType || 'UNKNOWN';
      const orderVal = Number(entry.totalOrderValue || 0);
      const billedVal = Number(entry.totalBilled || 0);

      recordTypeMap.set(recordType, (recordTypeMap.get(recordType) || 0) + 1);
      dateMap.set(docDate, (dateMap.get(docDate) || 0) + orderVal);
      docTypeMap.set(docType, (docTypeMap.get(docType) || 0) + billedVal);
      orderValues.push(orderVal);
    }

    this.totalOrdersByRecordType = Array.from(recordTypeMap.entries()).map(([type, count]) => ({ name: type, value: count }));
    this.totalOrderValueByDate = Array.from(dateMap.entries()).map(([date, value]) => ({ name: date, value }));
    this.totalBilledByDocType = Array.from(docTypeMap.entries()).map(([type, value]) => ({ name: type, value }));
    this.orderValueDistribution = orderValues.map((val, idx) => ({ name: `Order ${idx+1}`, value: val }));
  }

  toggleInsights(): void {
    this.showInsights = !this.showInsights;
  }

  currencyFormatter(params: any) {
    const value = params.value;
    const currencyCode = params.data?.currency || 'INR';
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
}
