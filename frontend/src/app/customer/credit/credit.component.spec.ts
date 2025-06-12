import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CreditComponent } from './credit.component';
import { AgGridModule } from 'ag-grid-angular';  // Import AgGridModule


describe('CreditComponent', () => {
  let component: CreditComponent;
  let fixture: ComponentFixture<CreditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreditComponent],
      imports: [
        HttpClientTestingModule,
        AgGridModule,  // Initialize AgGridModule without custom components
        
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
