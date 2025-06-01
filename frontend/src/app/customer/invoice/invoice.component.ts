import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer/customer.service';  // Updated import
import { ColDef } from 'ag-grid-community';
import { saveAs } from 'file-saver';  // Make sure you have file-saver installed

@Component({
  selector: 'app-invoice',
  standalone: false,
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {
  rowData: any[] = [];
  selectedRow: any = null;
  selectedItems: any[] = [];
  showDetailPopup: boolean = false;
  popupTitle: string = 'Items for invoice';

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

  constructor(private cuService: CustomerService) {}  // Updated service

  ngOnInit(): void {
    this.fetchCustomerInvoices();
  }

  fetchCustomerInvoices(): void {
    this.cuService.getCustomerInvoices().subscribe({
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

  onRowClicked(event: any) {
    this.selectedItems = event.data.items;
    this.selectedRow = event.data;
    this.showDetailPopup = true;
  }

  closeDetailPopup() {
    this.showDetailPopup = false;
  }

  downloadInvoicePDF() {
    if (!this.selectedRow?.vbeln) {
      alert('No invoice selected.');
      return;
    }

    this.cuService.downloadInvoicePDF(this.selectedRow.vbeln).subscribe({  // Updated service
      next: (blob) => {
        const fileName = `Invoice_${this.selectedRow.vbeln}.pdf`;
        saveAs(blob, fileName);
      },
      error: (err) => {
        console.error('Download failed:', err);
        alert('Failed to download invoice PDF.');
      }
    });
  }
}
