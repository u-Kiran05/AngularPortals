import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module'; 
import { CustomerComponent } from './customer.component'; 
import { SalesComponent } from './sales/sales.component';
import { DeliveryComponent } from './delivery/delivery.component';
import { CdashboardComponent } from './cdashboard/cdashboard.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { PaymentComponent } from './payment/payment.component';

import { AgGridModule } from 'ag-grid-angular';
 import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { InquiryComponent } from './inquiry/inquiry.component';
    
ModuleRegistry.registerModules([ AllCommunityModule ]);
@NgModule({
  declarations: [
    CustomerComponent ,
    SalesComponent,
    DeliveryComponent,
    CdashboardComponent,
    InvoiceComponent,
    PaymentComponent,
    InquiryComponent
   ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule ,
     AgGridModule,
  ]
})
export class CustomerModule { }