import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module'; 
import { VendorComponent } from './vendor.component';
import { VfinanceComponent } from './vfinance/vfinance.component';
import { VpurchaseComponent } from './vpurchase/vpurchase.component';
import { VdashboardComponent } from './vdashboard/vdashboard.component';
import { VquotationComponent } from './vquotation/vquotation.component';
import { VgoodsComponent } from './vgoods/vgoods.component';
import { VinvoiceComponent } from './vinvoice/vinvoice.component';
import { VagingComponent } from './vaging/vaging.component';
import { VcreditComponent } from './vcredit/vcredit.component';

import { AgGridModule } from 'ag-grid-angular';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

ModuleRegistry.registerModules([ AllCommunityModule ]);
@NgModule({
  declarations: [
    VendorComponent,
    VfinanceComponent,
    VpurchaseComponent,
    VdashboardComponent,
    VquotationComponent,
    VgoodsComponent,
    VinvoiceComponent,
    VagingComponent,
    VcreditComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AgGridModule,
    SharedModule 
  ]
})
export class vendormodule { }