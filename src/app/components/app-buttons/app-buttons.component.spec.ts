import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppButtonsComponent } from './app-buttons.component';

describe('AppButtonsComponent', () => {
  let component: AppButtonsComponent;
  let fixture: ComponentFixture<AppButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppButtonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
