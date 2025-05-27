import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-sales',
  standalone:false,
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {
  rowData: any[] = [];
  customerId: string = '';

  salesColumnDefs: ColDef[] = [
    { headerName: 'Sales Order No', field: 'vbeln' },
    { headerName: 'Created On', field: 'erdat' },
    { headerName: 'Type', field: 'auart' },
    {
      headerName: 'Net Value',
      field: 'netwr',
      valueFormatter: (params) => this.formatNetValue(params.value, params.data?.waerk)
    },
    { headerName: 'Currency', field: 'waerk' }
  ];

  itemColumnDefs: ColDef[] = [
    { headerName: 'Item No', field: 'posnr' },
    { headerName: 'Material No', field: 'matnr' },
    { headerName: 'Description', field: 'arktx' },
    { headerName: 'Quantity', field: 'kwmeng' },
    { headerName: 'UOM', field: 'vrkme' },
    {
      headerName: 'Net Value',
      field: 'netwr',
      valueFormatter: (params) => this.formatNetValue(params.value, params.data?.waerk)
    },
    { headerName: 'Currency', field: 'waerk' }
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
      this.fetchCustomerSales(this.customerId);
    }
  }

  fetchCustomerSales(customerId: string): void {
    this.authService.getCustomerSales().subscribe({
      next: (res) => {
        const { headerData = [], itemData = [] } = res;
        const itemsBySalesOrderNo: Record<string, any[]> = {};

        itemData.forEach((item: any) => {
          if (!itemsBySalesOrderNo[item.salesOrderNo]) {
            itemsBySalesOrderNo[item.salesOrderNo] = [];
          }
          itemsBySalesOrderNo[item.salesOrderNo].push({
            posnr: item.itemNo,
            matnr: item.materialNo,
            arktx: item.description,
            netwr: item.netValue,
            kwmeng: item.quantity,
            vrkme: item.unit,
            waerk: item.currency
          });
        });

        this.rowData = headerData.map((header: any) => ({
          vbeln: header.salesOrderNo,
          auart: header.docType,
          erdat: header.orderDate,
          netwr: header.netValue,
          waerk: header.currency,
          items: itemsBySalesOrderNo[header.salesOrderNo] || []
        }));
      },
      error: (err) => {
        console.error('Failed to load sales orders:', err);
        this.rowData = [];
      }
    });
  }

  formatNetValue(value: any, currency: string): string {
    if (!value) return '';
    let symbol = '';

    switch (currency) {
      case 'USD': symbol = '$'; break;
      case 'INR': symbol = '₹'; break;
      case 'EUR': symbol = '€'; break;
      case 'GBP': symbol = '£'; break;
      default: symbol = currency || '';
    }

    return `${symbol}${value}`;
  }
}
