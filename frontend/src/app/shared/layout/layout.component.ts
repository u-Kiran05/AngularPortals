import { Component, Input, Output, EventEmitter, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export interface MenuItem {
  icon: string;
  title: string;
  link: string;
}

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  @Input() headerTitle: string = 'ERP Dashboard';
  @Input() menuItems: MenuItem[] = [];
  @Output() menuClick = new EventEmitter<string>();

  logoutItem: MenuItem = { icon: 'logout', title: 'Logout', link: '/logout' };

  isCollapsed = false;
  isDarkMode = false;
  showProfileCard = false;
  selectedMenu: string = ''; // Added for selection effect

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.selectedMenu = this.router.url;  // Initialize from URL
  }

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
    this.authService.clearUserInfo();
    this.router.navigate(['/login']);
  }

  onMenuClick(link: string): void {
    this.selectedMenu = link;  // Track selected menu item
    this.menuClick.emit(link);
    this.router.navigate([link]);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const insideCard = target.closest('app-profile-card') || target.closest('button[mat-icon-button]');
    if (!insideCard) this.showProfileCard = false;
  }
}
