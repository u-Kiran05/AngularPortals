import { Injectable } from '@angular/core';
import introJs from 'intro.js';

@Injectable({ providedIn: 'root' })
export class IntroService {
  private readonly storagePrefix = 'layoutTutorialShown_';

  public start(role: string): void {
    const steps = [
      { element: '#sidebar-menu', intro: 'This is your main navigation sidebar.' },
      { element: '#logout-btn', intro: 'Click here to log out securely.' },
      { element: '#sap-status-btn', intro: 'Shows SAP system connectivity.' },
      { element: '#dark-mode-btn', intro: 'Switch between dark and light modes.' },
      { element: '#profile-btn', intro: 'Access your user profile here.' },
      { element: '#help-button', intro: 'Restart this tutorial anytime from here.' }
    ];

    if (role === 'customer') {
      steps.unshift({ element: '.dashboard-customer', intro: 'Customer dashboard section.' });
    } else if (role === 'vendor') {
      steps.unshift({ element: '.dashboard-vendor', intro: 'Vendor dashboard section.' });
    } else if (role === 'employee') {
      steps.unshift({ element: '.dashboard-employee', intro: 'Employee dashboard section.' });
    }

    introJs().setOptions({
      steps,
      showProgress: true,
      tooltipPosition: 'auto' as any,
      exitOnOverlayClick: false,
    }).start();
  }

public shouldStartTutorial(role: string): boolean {
  return true; 
}


  public markTutorialShown(role: string): void {
    localStorage.setItem(this.storagePrefix + role, 'true');
  }
}
