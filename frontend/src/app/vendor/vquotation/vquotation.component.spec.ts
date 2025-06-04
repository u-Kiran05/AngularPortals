import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VquotationComponent } from './vquotation.component';

describe('VquotationComponent', () => {
  let component: VquotationComponent;
  let fixture: ComponentFixture<VquotationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VquotationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VquotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
