import { Component } from '@angular/core';
import { EmployeeService } from '../../services/employee/employee.service';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ViewEncapsulation } from '@angular/core';
@Component({
  selector: 'app-epay',
  standalone:false,
  templateUrl: './epay.component.html',
  styleUrls: ['./epay.component.scss'],
   encapsulation: ViewEncapsulation.None
})
export class EpayComponent {
  monthControl = new FormControl(new Date());
  headerData: any = null;
  itemList: any[] = [];
  emailAddress = '';

  constructor(private employeeService: EmployeeService, private http: HttpClient) {}

  ngOnInit() {
    this.fetchPayslip();
  }

  fetchPayslip() {
    this.employeeService.getEmployeePayslip().subscribe(res => {
      if (res.success) {
        this.headerData = res.data.header;
        this.itemList = res.data.items;
      }
    });
  }

  downloadPDF() {
    this.employeeService.downloadPayslipPDF().subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Payslip.pdf';
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }
// When full date is selected (should not be triggered for month picker, but safe to have)
onMonthChange(event: any) {
  const selectedDate = event.value;
  this.monthControl.setValue(selectedDate);
  this.fetchPayslip(); // or pass selectedDate if needed
}

// Called when user selects just month
chosenMonthHandler(normalizedMonth: Date, datepicker: any) {
  const ctrlValue = this.monthControl.value || new Date();
  ctrlValue.setMonth(normalizedMonth.getMonth());
  ctrlValue.setFullYear(normalizedMonth.getFullYear());
  this.monthControl.setValue(new Date(ctrlValue));
  datepicker.close();
  this.fetchPayslip();
}

  sendEmail() {
  if (!this.emailAddress || !this.emailAddress.includes('@')) {
    alert('Please enter a valid email address.');
    return;
  }

  this.employeeService.sendPayslipEmail(this.emailAddress).subscribe({
    next: () => alert('Payslip emailed successfully!'),
    error: err => {
      console.error(err);
      alert('Failed to send payslip. Please try again.');
    }
  });
}

}
