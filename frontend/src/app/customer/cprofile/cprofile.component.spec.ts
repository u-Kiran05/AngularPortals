import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CprofileComponent } from './cprofile.component';

describe('CprofileComponent', () => {
  let component: CprofileComponent;
  let fixture: ComponentFixture<CprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CprofileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
