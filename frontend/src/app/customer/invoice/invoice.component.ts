import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-invoice',
  standalone:false,
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {
  rowData: any[] = [];
  customerId: string = '';

  invoiceColumnDefs: ColDef[] = [
    { headerName: 'Invoice No', field: 'vbeln' },
    { headerName: 'Billing Date', field: 'fkdat' },
    { headerName: 'Net Value', field: 'netwr' },
    { headerName: 'Currency', field: 'waerk' },
    { headerName: 'Company Code', field: 'bukrs' },
    { headerName: 'Created On', field: 'erdat' }
  ];

  itemColumnDefs: ColDef[] = [
    { headerName: 'Item No', field: 'posnr' },
    { headerName: 'Material No', field: 'matnr' },
    { headerName: 'Description', field: 'arktx' },
    { headerName: 'Quantity', field: 'fkimg' },
    { headerName: 'Unit', field: 'vrkme' },
    { headerName: 'Net Value', field: 'netwr' }
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
      this.fetchCustomerInvoices(this.customerId);
    }
  }

  fetchCustomerInvoices(customerId: string): void {
    this.authService.getCustomerInvoices().subscribe({
      next: (res) => {
        const { data } = res || {};
        const T_HEADER = data?.headers ?? [];
        const T_ITEMS = data?.items ?? [];
        const itemsByInvoiceNo: Record<string, any[]> = {};

        T_ITEMS.forEach((item: any) => {
          if (!itemsByInvoiceNo[item.vbeln]) {
            itemsByInvoiceNo[item.vbeln] = [];
          }
          itemsByInvoiceNo[item.vbeln].push(item);
        });

        this.rowData = T_HEADER.map((header: any) => ({
          ...header,
          items: itemsByInvoiceNo[header.vbeln] || []
        }));
      },
      error: (err) => {
        console.error('Failed to load invoices:', err);
        this.rowData = [];
      }
    });
  }
}
