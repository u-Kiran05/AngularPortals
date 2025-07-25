import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileCardComponent } from './profile.component';

describe('ProfileComponent', () => {
  let component: ProfileCardComponent;
  let fixture: ComponentFixture<ProfileCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
