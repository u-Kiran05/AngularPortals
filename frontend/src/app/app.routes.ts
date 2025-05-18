import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { CustomerComponent } from './customer/customer.component';
import { VendorComponent } from './vendor/vendor.component';
import { InquiryComponent } from './customer/inquiry/inquiry.component';
import { SalesComponent } from './customer/sales/sales.component';
import { DeliveryComponent } from './customer/delivery/delivery.component';
import { InvoiceComponent } from './customer/invoice/invoice.component';
import { PaymentComponent } from './customer/payment/payment.component';
import { CreditComponent } from './customer/credit/credit.component';
import { CdashboardComponent } from './customer/cdashboard/cdashboard.component';
import { ProfileComponent } from './shared/profile/profile.component';
import { VdashboardComponent } from './vendor/vdashboard/vdashboard.component';
import { VfinanceComponent } from './vendor/vfinance/vfinance.component';
import { EmployeeComponent } from './employee/employee.component';
import { EdashboardComponent } from './employee/edashboard/edashboard.component';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'customer',
    component: CustomerComponent,
    children: [
      { path: 'cdashboard', component:CdashboardComponent},
      { path: 'inquiry', component: InquiryComponent },
      { path: 'sales', component: SalesComponent },
      { path: 'delivery', component: DeliveryComponent },
      { path: 'invoice', component: InvoiceComponent },
      { path: 'payment', component: PaymentComponent },
      { path: 'credit', component: CreditComponent },
      { path: '', redirectTo: 'cdashboard', pathMatch: 'full' }
    ]
  },
  { path: 'vendor', component: VendorComponent,
    children:[
      { path: 'vdashboard', component:VdashboardComponent},
      { path: 'vfinance', component: VfinanceComponent },
      { path: '', redirectTo: 'vdashboard', pathMatch: 'full' }
    ]
   },
   { path: 'employee', component: EmployeeComponent,
    children:[
      { path: 'edashboard', component:EdashboardComponent},
      
      { path: '', redirectTo: 'edashboard', pathMatch: 'full' }
    ]
   },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'profile', component: ProfileComponent }

];
