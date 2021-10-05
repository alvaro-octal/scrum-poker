import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserHorizontalComponent } from './user-horizontal.component';

describe('UserComponent', () => {
  let component: UserHorizontalComponent;
  let fixture: ComponentFixture<UserHorizontalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserHorizontalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserHorizontalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
