import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DeliveryComponent } from './delivery.component';
import { AgGridModule } from 'ag-grid-angular';  // Import AgGridModule


describe('CreditComponent', () => {
  let component: DeliveryComponent;
  let fixture: ComponentFixture<DeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeliveryComponent],
      imports: [
        HttpClientTestingModule,
        AgGridModule,  // Initialize AgGridModule without custom components
        
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
