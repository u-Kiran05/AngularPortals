import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-inquiry',
  standalone: false,
  templateUrl: './inquiry.component.html',
  styleUrls: ['./inquiry.component.scss']
})
export class InquiryComponent implements OnInit {
  rowData: any[] = [];
  selectedItems: any[] = [];
  selectedInquiryNo: string = '';
  customerId: string = '';
  showDetailPopup = false;

 inquiryColumnDefs: ColDef[] = [
  { headerName: 'Inquiry No', field: 'vbeln', headerClass: 'custom-header' },
  { headerName: 'Created On', field: 'erdat', headerClass: 'custom-header' },
  { headerName: 'Type', field: 'auart', headerClass: 'custom-header' },
  { headerName: 'Valid From', field: 'angdt', headerClass: 'custom-header' },
  { headerName: 'Valid To', field: 'bnddt', headerClass: 'custom-header' }
];

itemColumnDefs: ColDef[] = [
  { headerName: 'Item No', field: 'posnr', headerClass: 'custom-header' },
  { headerName: 'Material No', field: 'matnr', headerClass: 'custom-header' },
  { headerName: 'Description', field: 'arktx', headerClass: 'custom-header' },
  { headerName: 'Quantity', field: 'kwmeng', headerClass: 'custom-header' },
  { headerName: 'UOM', field: 'vrkme', headerClass: 'custom-header' }
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
    this.authService.getCustomerInquiries(customerId).subscribe({
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

  onRowClicked(event: any): void {
    this.selectedItems = event.data.items;
    this.selectedInquiryNo = event.data.vbeln;
    this.showDetailPopup = true;
  }

  closeDetailPopup(): void {
    this.showDetailPopup = false;
  }
}
