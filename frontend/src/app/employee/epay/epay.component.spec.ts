import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpayComponent } from './epay.component';

describe('EpayComponent', () => {
  let component: EpayComponent;
  let fixture: ComponentFixture<EpayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EpayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EpayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
