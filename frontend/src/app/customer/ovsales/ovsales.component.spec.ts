import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OvsalesComponent } from './ovsales.component';

describe('OvsalesComponent', () => {
  let component: OvsalesComponent;
  let fixture: ComponentFixture<OvsalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OvsalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OvsalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
