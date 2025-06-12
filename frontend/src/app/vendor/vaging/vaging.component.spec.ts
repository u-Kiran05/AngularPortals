import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VagingComponent } from './vaging.component';

describe('VagingComponent', () => {
  let component: VagingComponent;
  let fixture: ComponentFixture<VagingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VagingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
