import { TestBed } from '@angular/core/testing';
import { CustomerComponent } from './customer.component';
import { SharedModule } from '../shared/shared.module';  // Adjust path as needed
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';  // Add this!

describe('CustomerComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomerComponent],
      imports: [
        SharedModule,  // Contains LayoutComponent and possibly other shared declarations
        RouterTestingModule,
        HttpClientTestingModule,  // This provides the mocked HttpClient
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(CustomerComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
