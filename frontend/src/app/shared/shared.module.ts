import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon'; 
import { LayoutComponent } from './layout/layout.component';
import { ProfileCardComponent } from './profile/profile.component';
import { MatDividerModule } from '@angular/material/divider';
import { TablewithItemsComponent } from './tablewith-items/tablewith-items.component';
import { AgGridModule } from 'ag-grid-angular';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { AgTableComponent } from './ag-table/ag-table.component';

ModuleRegistry.registerModules([ AllCommunityModule ]);
@NgModule({
  declarations: [
    LayoutComponent,ProfileCardComponent,TablewithItemsComponent,AgTableComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,MatDividerModule,AgGridModule,
  ],
  exports: [
    TablewithItemsComponent,
    AgTableComponent,
    ProfileCardComponent,
    LayoutComponent,
    CommonModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule // Export MatIconModule if needed in other modules
  ]
})
export class SharedModule { }