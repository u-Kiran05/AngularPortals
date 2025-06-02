import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer/customer.service';
import { ColDef } from 'ag-grid-community';
import { ViewEncapsulation } from '@angular/core';
@Component({
  selector: 'app-delivery',
  standalone: false,
  templateUrl: './delivery.component.html',
  styleUrl: './delivery.component.scss',
   encapsulation: ViewEncapsulation.None
})
export class DeliveryComponent implements OnInit {
  rowData: any[] = [];
  customerId: string = '';

  deliveryColumnDefs: ColDef[] = [
    { headerName: 'Delivery No', field: 'vbeln' },
    { headerName: 'Created On', field: 'erdat' },
    { headerName: 'Delivery Date', field: 'lfdat' },
    { headerName: 'Shipping Point', field: 'vstel' },
    { headerName: 'Currency', field: 'waerk' }
  ];

  itemColumnDefs: ColDef[] = [
    { headerName: 'Item No', field: 'posnr' },
    { headerName: 'Material No', field: 'matnr' },
    { headerName: 'Description', field: 'arktx' },
    { headerName: 'Quantity', field: 'lfimg' }
  ];

  defaultColDef: ColDef = {
    flex: 1,
    resizable: true,
    sortable: true,
    filter: true,
    headerClass: 'custom-header'
  };

  constructor(private cuService: CustomerService) {}  // Updated constructor

  ngOnInit(): void {
    this.fetchCustomerDeliveries();  // No need for customerId, handled inside service
  }

  fetchCustomerDeliveries(): void {
    this.cuService.getCustomerDeliveries().subscribe({
      next: (res) => {
        const { data } = res || {};
        const T_HEADER = data?.headers ?? [];
        const T_ITEMS = data?.items ?? [];

        const itemsByDeliveryNo: Record<string, any[]> = {};
        T_ITEMS.forEach((item: any) => {
          if (!itemsByDeliveryNo[item.vbeln]) {
            itemsByDeliveryNo[item.vbeln] = [];
          }
          itemsByDeliveryNo[item.vbeln].push(item);
        });

        this.rowData = T_HEADER.map((header: any) => ({
          ...header,
          items: itemsByDeliveryNo[header.vbeln] || []
        }));
      },
      error: (err) => {
        console.error('Failed to load deliveries:', err);
        this.rowData = [];
      }
    });
  }
}
