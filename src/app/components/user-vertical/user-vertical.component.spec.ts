import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserVerticalComponent } from './user-vertical.component';

describe('UserComponent', () => {
  let component: UserVerticalComponent;
  let fixture: ComponentFixture<UserVerticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserVerticalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserVerticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
