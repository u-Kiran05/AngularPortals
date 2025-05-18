import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeComponent } from './employee.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [EmployeeComponent],
  imports: [
    CommonModule,
    SharedModule,RouterModule,
  ]
})
export class EmployeeModule { }
