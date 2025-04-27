import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamiliaryCalendarPage } from './familiary-calendar.page';

describe('FamiliaryCalendarPage', () => {
  let component: FamiliaryCalendarPage;
  let fixture: ComponentFixture<FamiliaryCalendarPage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(FamiliaryCalendarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
