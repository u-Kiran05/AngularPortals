import { NgModule } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';

import { CommonModule } from '@angular/common';
import { EmployeeComponent } from './employee.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { EleaveComponent } from './eleave/eleave.component';
import { AgGridModule } from 'ag-grid-angular';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { EpayComponent } from './epay/epay.component';
ModuleRegistry.registerModules([ AllCommunityModule ]);
@NgModule({
  declarations: [EmployeeComponent,EleaveComponent,EpayComponent],
  imports: [
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AgGridModule,SharedModule,RouterModule
  ]
})
export class EmployeeModule { }
