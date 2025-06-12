import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { VendorService } from '../../services/vendor/vendor.service';
import { ColDef } from 'ag-grid-community';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-vinvoice',
  standalone: false,
  templateUrl: './vinvoice.component.html',
  styleUrls: ['./vinvoice.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VinvoiceComponent implements OnInit {
  rowData: any[] = [];
  selectedRow: any = null;
  showInvoiceGif: boolean = false;
  showDownloadButton: boolean = true;

  popupTitle: string = 'Vendor Invoices';

  invoiceColumnDefs: ColDef[] = [
    { headerName: 'Invoice No', field: 'belnr' },
    { headerName: 'Posting Date', field: 'budat' },
    { headerName: 'Document Date', field: 'bldat' },
    { headerName: 'Amount', field: 'rmwwr' },
    { headerName: 'Currency', field: 'waers' },
    { headerName: 'Company Code', field: 'bukrs' }
  ];

  itemColumnDefs: ColDef[] = [
    { headerName: 'PO No', field: 'ebeln' },
    { headerName: 'Item', field: 'ebelp' },
    { headerName: 'Material No', field: 'matnr' },
    { headerName: 'Description', field: 'maktx' },
    { headerName: 'Quantity', field: 'menge' },
    { headerName: 'Unit', field: 'meins' },
    { headerName: 'Amount', field: 'wrbtr' }
  ];

  defaultColDef: ColDef = {
    flex: 1,
    resizable: true,
    sortable: true,
    filter: true,
    headerClass: 'custom-header'
  };

  constructor(private vendorService: VendorService) {}

  ngOnInit(): void {
    this.fetchVendorInvoices();
  }

  fetchVendorInvoices(): void {
    this.vendorService.getVendorInvoices().subscribe({
      next: (invoices: any[]) => {
        this.rowData = invoices.map(inv => ({
          ...inv,
          items: inv.items || []
        }));
      },
      error: (err) => {
        console.error('Failed to load vendor invoices:', err);
        this.rowData = [];
      }
    });
  }

  onRowClicked(row: any) {
    this.selectedRow = row;
  }

  downloadInvoicePDF() {
    if (!this.selectedRow?.belnr) {
      alert('No invoice selected.');
      return;
    }

    this.vendorService.downloadVendorInvoicePDF(this.selectedRow.belnr).subscribe({
      next: (blob) => {
        const fileName = `Vendor_Invoice_${this.selectedRow.belnr}.pdf`;
        saveAs(blob, fileName);
      },
      error: (err) => {
        console.error('Download failed:', err);
        alert('Failed to download vendor invoice PDF.');
      }
    });
  }

  toggleDownloadButton() {
    this.showDownloadButton = !this.showDownloadButton;
  }
}
