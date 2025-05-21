import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon'; // Add MatIconModule
import { LayoutComponent } from './layout/layout.component';
import { ProfileComponent } from './profile/profile.component';
import { MatDividerModule } from '@angular/material/divider';
import { SalesComponent } from '../customer/sales/sales.component';
@NgModule({
  declarations: [
    LayoutComponent,ProfileComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,MatDividerModule // Include MatIconModule
  ],
  exports: [
    ProfileComponent,
    LayoutComponent,
    CommonModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule // Export MatIconModule if needed in other modules
  ]
})
export class SharedModule { }