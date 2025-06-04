import { Component, OnInit } from '@angular/core';
import { VendorService } from '../../services/vendor/vendor.service';
import { ColDef } from 'ag-grid-community';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-vpurchase',
  standalone: false,
  templateUrl: './vpurchase.component.html',
  styleUrls: ['./vpurchase.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VpurchaseComponent implements OnInit {
  rowData: any[] = [];
  showGif = false;

  purchaseColumnDefs: ColDef[] = [
    { headerName: 'Purchase Number', field: 'ebeln' },
    { headerName: 'Company Code', field: 'bukrs' },
    { headerName: 'Created On', field: 'bedat' },
    { headerName: 'PO Type', field: 'bsart' },
    { headerName: 'Category', field: 'bstyp' }
  ];

  itemColumnDefs: ColDef[] = [
    { headerName: 'Item No', field: 'ebelp' },
    { headerName: 'Material No', field: 'matnr' },
    { headerName: 'Quantity', field: 'menge' },
    { headerName: 'Plant', field: 'werks' },
    { headerName: 'Net Price', field: 'netwr' }
  ];

  defaultColDef: ColDef = {
    flex: 1,
    resizable: true,
    sortable: true,
    filter: true,
    headerClass: 'custom-header'
  };

  constructor(private veService: VendorService) {}

  ngOnInit(): void {
    this.fetchVendorPOs();
  }

  fetchVendorPOs(): void {
    this.veService.getVendorPurchaseOrders().subscribe({
      next: (poList: any[]) => {
        this.rowData = poList.map(po => ({
          ...po,
          items: po.items || []
        }));
      },
      error: (err) => {
        console.error('[Vpurchase] Failed to load vendor purchase orders:', err);
      }
    });
  }
}
