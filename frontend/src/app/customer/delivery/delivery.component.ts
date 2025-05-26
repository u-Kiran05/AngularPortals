import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-delivery',
  standalone:false,
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss']
})
export class DeliveryComponent implements OnInit {
  rowData: any[] = [];
  selectedItems: any[] = [];
  selectedDeliveryNo: string = '';
  customerId: string = '';
  showDetailPopup = false;

  deliveryColumnDefs: ColDef[] = [
    { headerName: 'Delivery No', field: 'vbeln', headerClass: 'custom-header' },
    { headerName: 'Created On', field: 'erdat', headerClass: 'custom-header' },
    { headerName: 'Delivery Date', field: 'lfdat', headerClass: 'custom-header' },
    { headerName: 'Shipping Point', field: 'vstel', headerClass: 'custom-header' },
    //{ headerName: 'Route', field: 'route', headerClass: 'custom-header' },
    { headerName: 'Currency', field: 'waerk', headerClass: 'custom-header' }
  ];

  itemColumnDefs: ColDef[] = [
    { headerName: 'Item No', field: 'posnr', headerClass: 'custom-header' },
    { headerName: 'Material No', field: 'matnr', headerClass: 'custom-header' },
    { headerName: 'Description', field: 'arktx', headerClass: 'custom-header' },
    { headerName: 'Quantity', field: 'lfimg', headerClass: 'custom-header' }
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
      this.fetchCustomerDeliveries(this.customerId);
    }
  }

fetchCustomerDeliveries(customerId: string): void {
  this.authService.getCustomerDeliveries(customerId).subscribe({
    next: (res) => {
      console.log('Raw backend response:', res);

      const { data } = res || {};
      const T_HEADER = data?.headers ?? [];
      const T_ITEMS = data?.items ?? [];

      console.log('T_HEADER:', T_HEADER);
      console.log('T_ITEMS:', T_ITEMS);

      const itemsByDeliveryNo: Record<string, any[]> = {};

      T_ITEMS.forEach((item: any) => {
        if (!itemsByDeliveryNo[item.vbeln]) {
          itemsByDeliveryNo[item.vbeln] = [];
        }
        itemsByDeliveryNo[item.vbeln].push({
          posnr: item.posnr,
          matnr: item.matnr,
          arktx: item.arktx,
          lfimg: item.lfimg
        });
      });

      this.rowData = T_HEADER.map((header: any) => ({
        vbeln: header.vbeln,
        erdat: header.erdat,
        lfdat: header.lfdat,
        vstel: header.vstel,
        route: header.route,
        waerk: header.waerk,
        items: itemsByDeliveryNo[header.vbeln] || []
      }));

      console.log('Processed rowData:', this.rowData);
    },
    error: (err) => {
      console.error('Failed to load deliveries:', err);
      this.rowData = [];
    }
  });
}


  onRowClicked(event: any): void {
    this.selectedItems = event.data.items;
    this.selectedDeliveryNo = event.data.vbeln;
    this.showDetailPopup = true;
  }

  closeDetailPopup(): void {
    this.showDetailPopup = false;
  }
}
