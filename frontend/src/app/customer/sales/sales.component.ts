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
    { headerName: 'Sales Org', field: 'salesOrg', filter: true, sortable: true },
    { headerName: 'Distribution Channel', field: 'distChannel', filter: true, sortable: true },
    { headerName: 'Division', field: 'division', filter: true, sortable: true },
    { headerName: 'Sales District', field: 'salesDistrict', filter: true, sortable: true }
  ];

  defaultColDef: ColDef = {
    flex: 1,
    resizable: true
  };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.getUserInfo();
    if (user && user.id) {
      this.customerId = user.id;
      this.fetchCustomerSales(this.customerId);
      console.log( this.fetchCustomerSales(this.customerId));
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
