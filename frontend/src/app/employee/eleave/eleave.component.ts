import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { EmployeeService } from '../../services/employee/employee.service';

@Component({
  selector: 'app-eleave',
  standalone:false,
  templateUrl: './eleave.component.html',
  styleUrl: './eleave.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class EleaveComponent {
  rowData: any[] = [];

  leaveColumnDefs: ColDef[] = [
   // { headerName: 'Employee ID', field: 'pernr' },
    { headerName: 'Absence Type', field: 'awart' },
    { headerName: 'Start Date', field: 'begda' },
    { headerName: 'End Date', field: 'endda' },
    { headerName: 'Days Taken', field: 'abrtg' },
    { headerName: 'Recorded Hours', field: 'abrst' },
    { headerName: 'Quota Used', field: 'anzhl' },
   // { headerName: 'Standard Hours', field: 'stdaz' },
    
  ];

  defaultColDef: ColDef = {
    flex: 1,
    resizable: true,
    sortable: true,
    filter: true
  };

  constructor(private empService: EmployeeService) {}

  ngOnInit(): void {
    this.empService.getEmployeeLeave().subscribe({
      next: (res) => {
        this.rowData = res?.data ?? [];
      },
      error: (err) => {
        console.error('Error fetching leave records:', err);
      }
    });
  }
}
