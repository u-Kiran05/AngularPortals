import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export interface MenuItem {
  icon: string;
  title: string;
  link: string;
}

@Component({
  selector: 'app-layout',
  standalone:false,
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  @Input() headerTitle: string = 'ERP Dashboard';
  @Input() menuItems: MenuItem[] = [];
  @Output() menuClick = new EventEmitter<string>();

  logoutItem: MenuItem = { icon: 'logout', title: 'Logout', link: '/logout' };

  isCollapsed = false;
  isDarkMode = false;
  showProfileCard = false;

  constructor(public authService: AuthService, private router: Router) {}

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
  }

  toggleProfileCard(): void {
    this.showProfileCard = !this.showProfileCard;
  }

  handleLogout(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  onMenuClick(link: string): void {
    this.menuClick.emit(link);
    this.router.navigate([link]);
  }

  getRoleIcon(): string {
    const role = this.authService.getUserInfo()?.role?.toLowerCase();
    if (role === 'vendor') return 'store';
    if (role === 'employee') return 'engineering';
    return 'person';
  }

  // Optional: Auto-close on outside click
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const insideCard = target.closest('.profile-card') || target.closest('button[mat-icon-button]');
    if (!insideCard) this.showProfileCard = false;
  }
}
