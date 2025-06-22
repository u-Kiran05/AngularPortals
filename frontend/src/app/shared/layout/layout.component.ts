import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ViewEncapsulation } from '@angular/core';
export interface MenuItem {
  icon: string;
  title: string;
  link: string;
}

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LayoutComponent implements OnInit {
  @Input() headerTitle: string = 'ERP Dashboard';
  @Input() menuItems: MenuItem[] = [];
  @Output() menuClick = new EventEmitter<string>();

  logoutItem: MenuItem = { icon: 'logout', title: 'Logout', link: '/logout' };

  isCollapsed = false;
  isDarkMode = false;
  showProfileCard = false;
  selectedMenu: string = '';

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.selectedMenu = this.router.url;

   
    const savedMode = sessionStorage.getItem('darkMode');
    this.isDarkMode = savedMode === 'true';

    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    }


    if (!this.authService.isLoggedIn()) {
      this.isDarkMode = false;
      sessionStorage.removeItem('darkMode');
      document.body.classList.remove('dark-mode');
    }
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    sessionStorage.setItem('darkMode', String(this.isDarkMode));

    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  toggleProfileCard(): void {
    this.showProfileCard = !this.showProfileCard;
  }

  handleLogout(): void {
    this.authService.clearUserInfo();

 
    sessionStorage.removeItem('darkMode');
    document.body.classList.remove('dark-mode');
    this.isDarkMode = false;

    this.router.navigate(['/login']);
  }

  onMenuClick(link: string): void {
    this.selectedMenu = link;
    this.menuClick.emit(link);
    this.router.navigate([link]);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const insideCard =
      target.closest('app-profile-card') || target.closest('button[mat-icon-button]');
    if (!insideCard) this.showProfileCard = false;
  }
}
