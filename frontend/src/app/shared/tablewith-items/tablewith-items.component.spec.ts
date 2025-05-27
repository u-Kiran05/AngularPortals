import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablewithItemsComponent } from './tablewith-items.component';

describe('TablewithItemsComponent', () => {
  let component: TablewithItemsComponent;
  let fixture: ComponentFixture<TablewithItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablewithItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablewithItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
