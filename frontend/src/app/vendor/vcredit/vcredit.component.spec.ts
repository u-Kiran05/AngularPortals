import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VcreditComponent } from './vcredit.component';

describe('VcreditComponent', () => {
  let component: VcreditComponent;
  let fixture: ComponentFixture<VcreditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VcreditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VcreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
