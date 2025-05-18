import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CdashboardComponent } from './cdashboard.component';

describe('CdashboardComponent', () => {
  let component: CdashboardComponent;
  let fixture: ComponentFixture<CdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CdashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
