import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module'; // Correct import path
import { VendorComponent } from './vendor.component';

@NgModule({
  declarations: [
    VendorComponent, // Adjust based on your actual components
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule // Import SharedModule
  ]
})
export class vendormodule { }