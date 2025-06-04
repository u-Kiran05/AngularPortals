import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VpurchaseComponent } from './vpurchase.component';

describe('VpurchaseComponent', () => {
  let component: VpurchaseComponent;
  let fixture: ComponentFixture<VpurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VpurchaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VpurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
