import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VinvoiceComponent } from './vinvoice.component';

describe('VinvoiceComponent', () => {
  let component: VinvoiceComponent;
  let fixture: ComponentFixture<VinvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VinvoiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VinvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
