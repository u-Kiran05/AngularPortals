import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module'; 
import { CustomerComponent } from './customer.component'; 

@NgModule({
  declarations: [
    CustomerComponent 
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule 
  ]
})
export class CustomerModule { }