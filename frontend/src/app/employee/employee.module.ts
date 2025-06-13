import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeComponent } from './employee.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { EleaveComponent } from './eleave/eleave.component';
import { AgGridModule } from 'ag-grid-angular';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

ModuleRegistry.registerModules([ AllCommunityModule ]);
@NgModule({
  declarations: [EmployeeComponent,EleaveComponent],
  imports: [
    CommonModule,
    AgGridModule,SharedModule,RouterModule
  ]
})
export class EmployeeModule { }
