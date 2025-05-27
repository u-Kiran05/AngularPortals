import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-inquiry',
  standalone:false,
  templateUrl: './inquiry.component.html',
  styleUrls: ['./inquiry.component.scss']
})
export class InquiryComponent implements OnInit {
  rowData: any[] = [];
  customerId: string = '';

  inquiryColumnDefs: ColDef[] = [
    { headerName: 'Inquiry No', field: 'vbeln' },
    { headerName: 'Created On', field: 'erdat' },
    { headerName: 'Type', field: 'auart' },
    { headerName: 'Valid From', field: 'angdt' },
    { headerName: 'Valid To', field: 'bnddt' }
  ];

  itemColumnDefs: ColDef[] = [
    { headerName: 'Item No', field: 'posnr' },
    { headerName: 'Material No', field: 'matnr' },
    { headerName: 'Description', field: 'arktx' },
    { headerName: 'Quantity', field: 'kwmeng' },
    { headerName: 'UOM', field: 'vrkme' }
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
      this.fetchCustomerInquiries(this.customerId);
    }
  }

  fetchCustomerInquiries(customerId: string): void {
    this.authService.getCustomerInquiries().subscribe({
      next: (res) => {
        const { inquiries = [], inquiryItems = [] } = res.data;
        const itemsByVbeln: Record<string, any[]> = {};
        inquiryItems.forEach((item: any) => {
          if (!itemsByVbeln[item.vbeln]) {
            itemsByVbeln[item.vbeln] = [];
          }
          itemsByVbeln[item.vbeln].push(item);
        });
        this.rowData = inquiries.map((inquiry: any) => ({
          ...inquiry,
          items: itemsByVbeln[inquiry.vbeln] || []
        }));
      },
      error: (err) => console.error('Failed to load inquiries:', err)
    });
  }
}
