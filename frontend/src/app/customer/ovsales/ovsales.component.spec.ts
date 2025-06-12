import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OvsalesComponent } from './ovsales.component';
import { AgGridModule } from 'ag-grid-angular';  // Import AgGridModule


describe('CreditComponent', () => {
  let component: OvsalesComponent;
  let fixture: ComponentFixture<OvsalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OvsalesComponent],
      imports: [
        HttpClientTestingModule,
        AgGridModule,  // Initialize AgGridModule without custom components
        
      ]
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
