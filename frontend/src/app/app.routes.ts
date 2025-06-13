import { Routes } from '@angular/router';
import { AuthGuard } from './services/authg.guard';
import { LoginComponent } from './auth/login/login.component';
//Customer Components
import { CustomerComponent } from './customer/customer.component';
import { VendorComponent } from './vendor/vendor.component';
import { InquiryComponent } from './customer/inquiry/inquiry.component';
import { SalesComponent } from './customer/sales/sales.component';
import { DeliveryComponent } from './customer/delivery/delivery.component';
import { InvoiceComponent } from './customer/invoice/invoice.component';
import { PaymentComponent } from './customer/payment/payment.component';
import { CreditComponent } from './customer/credit/credit.component';
import { OvsalesComponent } from './customer/ovsales/ovsales.component';
import { CdashboardComponent } from './customer/cdashboard/cdashboard.component';
//customer Components ends here

import { ProfileCardComponent } from './shared/profile/profile.component';
//Vendor Components
import { VdashboardComponent } from './vendor/vdashboard/vdashboard.component';
import { VfinanceComponent } from './vendor/vfinance/vfinance.component';
import { VpurchaseComponent } from './vendor/vpurchase/vpurchase.component';
//Vendor ends here
import { EmployeeComponent } from './employee/employee.component';
import { EdashboardComponent } from './employee/edashboard/edashboard.component';
import { VquotationComponent } from './vendor/vquotation/vquotation.component';
import { VgoodsComponent } from './vendor/vgoods/vgoods.component';
import { VinvoiceComponent } from './vendor/vinvoice/vinvoice.component';
import { VagingComponent } from './vendor/vaging/vaging.component';
import { VcreditComponent } from './vendor/vcredit/vcredit.component';
import { EleaveComponent } from './employee/eleave/eleave.component';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'customer',
    component: CustomerComponent,  canActivate: [AuthGuard] ,
    data: { role: 'Customer' },
    children: [
      { path: 'cdashboard', component:CdashboardComponent},
      { path: 'inquiry', component: InquiryComponent },
      { path: 'sales', component: SalesComponent },
      { path: 'delivery', component: DeliveryComponent },
      { path: 'invoice', component: InvoiceComponent },
      { path: 'payment', component: PaymentComponent },
      { path: 'credit', component: CreditComponent },
      {path:'ovsales',component:OvsalesComponent},
      { path: '', redirectTo: 'cdashboard', pathMatch: 'full' }
    ]
  },
  { path: 'vendor', component: VendorComponent,  canActivate: [AuthGuard] ,
     data: { role: 'Vendor' },
    children:[
      { path: 'vdashboard', component:VdashboardComponent},
      { path: 'vfinance', component: VfinanceComponent },
      {path:'vpurchase',component:VpurchaseComponent},
      {path:'vquotation',component:VquotationComponent},
      {path:'vgoods',component:VgoodsComponent},
      {path:'vinvoice',component:VinvoiceComponent},
      {path:'vaging',component:VagingComponent},
       {path:'vcandd',component:VcreditComponent},
      { path: '', redirectTo: 'vdashboard', pathMatch: 'full' }
    ]
   },
   { path: 'employee', component: EmployeeComponent, canActivate: [AuthGuard] ,
    data: { role: 'Employee' },
    children:[
      { path: 'edashboard', component:EdashboardComponent},
      {path:'eleave',component:EleaveComponent},
      { path: '', redirectTo: 'edashboard', pathMatch: 'full' }
    ]
   },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'profile', component: ProfileCardComponent }

];
