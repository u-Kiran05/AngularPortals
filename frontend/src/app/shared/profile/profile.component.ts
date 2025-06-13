import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CustomerService } from '../../services/customer/customer.service';
import { VendorService } from '../../services/vendor/vendor.service';
import { EmployeeService } from '../../services/employee/employee.service';

interface User {
  id?: string;
  role?: string;
  lastLogin?: Date;
}

interface CustomerProfile {
  name?: string;
  street?: string;
  city?: string;
  country?: string;
  postalCode?: string;
}

interface VendorProfile {
  name?: string;
  lifnr?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  region?: string;
  addressNumber?: string;
}

interface EmployeeProfile {
  id?: string;
  name?: string;
  gender?: string;
  dob?: string;
  nationality?: string;
  email?: string;
  companyCode?: string;
  subArea?: string;
  costCenter?: string;
  position?: string;
  job?: string;
  payScaleGroup?: string;
  basicPay?: string;
  city?: string;
  country?: string;
}

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileCardComponent implements OnInit {
  @Input() showProfileCard: boolean = false;
  user: User | null = null;
  customerProfile: CustomerProfile | null = null;
  vendorProfile: VendorProfile | null = null;
  employeeProfile: EmployeeProfile | null = null;
  profileName: string = 'Loading...';

  constructor(
    private authService: AuthService,
    private cuService: CustomerService,
    private veService: VendorService,
    private emService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  private loadUserProfile(): void {
    this.user = this.authService.getUserInfo();

    if (!this.user) {
      console.error('[ProfileCard] No user info available');
      this.profileName = 'Unknown User';
      return;
    }

    console.log('[ProfileCard] Loaded user info:', this.user);

    if (this.user.role === 'Customer') {
      this.loadCustomerProfile();
    } else if (this.user.role === 'Vendor') {
      this.loadVendorProfile();
    } else if (this.user.role === 'Employee') {
      this.loadEmployeeProfile();
    }
  }

  private loadCustomerProfile(): void {
    console.log('[ProfileCard] Detected Customer role');
    this.cuService.getCustomerProfile().subscribe({
      next: (profile) => {
        this.customerProfile = profile;
        this.profileName = profile.name || 'Unknown Customer';
        console.log('[ProfileCard] Customer profile fetched:', profile);
      },
      error: (err) => {
        console.error('[ProfileCard] Error fetching customer profile:', err);
        this.profileName = 'Error loading profile';
      }
    });
  }

  private loadVendorProfile(): void {
    console.log('[ProfileCard] Detected Vendor role');
    this.veService.getVendorProfile().subscribe({
      next: (profile) => {
        this.vendorProfile = profile;
        this.profileName = profile.name || 'Unknown Vendor';
        console.log('[ProfileCard] Vendor profile fetched:', profile);
      },
      error: (err) => {
        console.error('[ProfileCard] Error fetching vendor profile:', err);
        this.profileName = 'Error loading profile';
      }
    });
  }

  private loadEmployeeProfile(): void {
    console.log('[ProfileCard] Detected Employee role');
    this.emService.getEmployeeProfile().subscribe({
      next: (profile) => {
        this.employeeProfile = profile;
        this.profileName = profile.name || 'Unknown Employee';
        console.log('[ProfileCard] Employee profile fetched:', profile);
      },
      error: (err) => {
        console.error('[ProfileCard] Error fetching employee profile:', err);
        this.profileName = 'Error loading profile';
      }
    });
  }

  getRoleIcon(): string {
    switch (this.user?.role?.toLowerCase()) {
      case 'vendor': return 'store';
      case 'employee': return 'engineering';
      case 'customer': return 'person';
      default: return 'person_outline';
    }
  }
}
