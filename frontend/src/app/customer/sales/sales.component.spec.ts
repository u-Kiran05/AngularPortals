import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SalesComponent } from './sales.component';
import { AgGridModule } from 'ag-grid-angular';  // Import AgGridModule


describe('CreditComponent', () => {
  let component: SalesComponent;
  let fixture: ComponentFixture<SalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SalesComponent],
      imports: [
        HttpClientTestingModule,
        AgGridModule,  // Initialize AgGridModule without custom components
        
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
