import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { InvoiceComponent } from './invoice.component';
import { AgGridModule } from 'ag-grid-angular';  // Import AgGridModule


describe('CreditComponent', () => {
  let component: InvoiceComponent;
  let fixture: ComponentFixture<InvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvoiceComponent],
      imports: [
        HttpClientTestingModule,
        AgGridModule,  // Initialize AgGridModule without custom components
        
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
