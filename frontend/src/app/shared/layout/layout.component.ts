import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Router } from '@angular/router';
import { ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { interval, Subscription } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { SapStatusService, SapStatus } from '../../services/sap-status.service';
import { IntroService } from '../../services/intro.service';

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
export class LayoutComponent implements OnInit, OnDestroy {
  @Input() headerTitle: string = 'ERP Dashboard';
  @Input() menuItems: MenuItem[] = [];
  @Output() menuClick = new EventEmitter<string>();

  logoutItem: MenuItem = { icon: 'logout', title: 'Logout', link: '/logout' };

  isCollapsed = false;
  isDarkMode = false;
  showProfileCard = false;
  selectedMenu: string = '';
  sapStatusUp: boolean = false;
  tooltipPosition = new FormControl('below');
  private sapStatusSubscription!: Subscription;

  constructor(
    public authService: AuthService,
    private router: Router,
    private sapStatusService: SapStatusService,
    private introService: IntroService 
  ) {}

  ngOnInit(): void {
    this.selectedMenu = this.router.url;

    const savedMode = sessionStorage.getItem('darkMode');
    this.isDarkMode = savedMode === 'true';
    if (this.isDarkMode) document.body.classList.add('dark-mode');

    if (!this.authService.isLoggedIn()) {
      this.isDarkMode = false;
      sessionStorage.removeItem('darkMode');
      document.body.classList.remove('dark-mode');
    }

    this.checkSAPStatus();
    this.sapStatusSubscription = interval(10000).subscribe(() => this.checkSAPStatus());

    const role = this.authService.getCurrentUserRole();
    if (this.introService.shouldStartTutorial(role)) {
      this.introService.start(role);
      this.introService.markTutorialShown(role);
    }
  }

  checkSAPStatus(): void {
    this.sapStatusService.getStatus().subscribe({
      next: (status: SapStatus) => (this.sapStatusUp = status.up),
      error: () => (this.sapStatusUp = false)
    });
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    sessionStorage.setItem('darkMode', String(this.isDarkMode));
    document.body.classList.toggle('dark-mode', this.isDarkMode);
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

  startHelpTour(): void {
    const role = this.authService.getCurrentUserRole();
    this.introService.start(role);
  }

  ngOnDestroy(): void {
    if (this.sapStatusSubscription) this.sapStatusSubscription.unsubscribe();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const insideCard =
      target.closest('app-profile-card') || target.closest('button[mat-icon-button]');
    if (!insideCard) this.showProfileCard = false;
  }
}
