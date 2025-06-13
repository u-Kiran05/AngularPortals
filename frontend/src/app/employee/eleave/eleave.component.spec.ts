import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EleaveComponent } from './eleave.component';

describe('EleaveComponent', () => {
  let component: EleaveComponent;
  let fixture: ComponentFixture<EleaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EleaveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EleaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
