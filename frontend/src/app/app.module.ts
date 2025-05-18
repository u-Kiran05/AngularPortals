import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CustomerModule } from './customer/customer.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from './shared/shared.module';
import { vendormodule } from './vendor/vendor.module';
import { EmployeeModule } from './employee/employee.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent 
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    CustomerModule,EmployeeModule, vendormodule,
    SharedModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }