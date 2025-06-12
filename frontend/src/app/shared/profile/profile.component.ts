import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CustomerService } from '../../services/customer/customer.service';
import { VendorService } from '../../services/vendor/vendor.service';

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

@Component({
  selector: 'app-profile',
  standalone:false,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileCardComponent implements OnInit {
  @Input() showProfileCard: boolean = false;
  user: User | null = null;
  customerProfile: CustomerProfile | null = null;
  vendorProfile: VendorProfile | null = null;
  profileName: string = 'Loading...';

  constructor(
    private authService: AuthService,
    private cuService: CustomerService,
    private veService: VendorService
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
    if (!this.user?.id) {
      console.error('[ProfileCard] Missing vendor ID in user info');
      this.profileName = 'Invalid Vendor Profile';
      return;
    }

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

  getRoleIcon(): string {
    switch (this.user?.role?.toLowerCase()) {
      case 'vendor': return 'store';
      case 'employee': return 'engineering';
      case 'customer': return 'person';
      default: return 'person_outline';
    }
  }
}
