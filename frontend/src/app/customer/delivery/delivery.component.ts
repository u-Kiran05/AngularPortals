import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-delivery',
  standalone: false,
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss']
})
export class DeliveryComponent {
  rowData: any[] = [];
  customerId: string = '';

  columnDefs: ColDef[] = [
  { headerName: 'Delivery No.', field: 'vbeln', headerClass: 'custom-header', filter: true, sortable: true },
  { headerName: 'Delivery Date', field: 'erdat', headerClass: 'custom-header', filter: true, sortable: true },
  { headerName: 'Material No.', field: 'matnr', headerClass: 'custom-header', filter: true, sortable: true },
  { headerName: 'Material Desc', field: 'arktx', headerClass: 'custom-header', filter: true, sortable: true },
  { headerName: 'Quantity', field: 'lfimg', headerClass: 'custom-header', filter: true, sortable: true },
  { headerName: 'Unit', field: 'meins', headerClass: 'custom-header', filter: true, sortable: true }
];

defaultColDef: ColDef = {
  flex: 1,
  resizable: true,
  headerClass: 'custom-header'
};


  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.getUserInfo();
    if (user && user.id) {
      this.customerId = user.id;
      this.fetchCustomerDeliveries(this.customerId);
    }
  }

  fetchCustomerDeliveries(customerId: string): void {
    this.authService.getCustomerDeliveries(customerId).subscribe({
      next: (res) => {
        this.rowData = res.data || [];
      },
      error: (err) => {
        console.error('Failed to load delivery data:', err);
      }
    });
  }
}
