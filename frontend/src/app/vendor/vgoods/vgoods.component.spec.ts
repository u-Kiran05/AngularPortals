import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VgoodsComponent } from './vgoods.component';

describe('VgoodsComponent', () => {
  let component: VgoodsComponent;
  let fixture: ComponentFixture<VgoodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VgoodsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VgoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
