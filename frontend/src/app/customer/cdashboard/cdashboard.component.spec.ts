import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';  // Keep this for HttpClient
import { CdashboardComponent } from './cdashboard.component';

describe('CdashboardComponent', () => {
  let component: CdashboardComponent;
  let fixture: ComponentFixture<CdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CdashboardComponent],  // Correct: use declarations for non-standalone
      imports: [HttpClientTestingModule],   // Include HttpClientTestingModule if needed
    }).compileComponents();

    fixture = TestBed.createComponent(CdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
