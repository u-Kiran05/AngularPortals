import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VfinanceComponent } from './vfinance.component';

describe('VfinanceComponent', () => {
  let component: VfinanceComponent;
  let fixture: ComponentFixture<VfinanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VfinanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VfinanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
