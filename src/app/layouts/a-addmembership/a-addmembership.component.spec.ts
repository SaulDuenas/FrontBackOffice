import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AAddmembershipComponent } from './a-addmembership.component';

describe('AAddmembershipComponent', () => {
  let component: AAddmembershipComponent;
  let fixture: ComponentFixture<AAddmembershipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AAddmembershipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AAddmembershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
