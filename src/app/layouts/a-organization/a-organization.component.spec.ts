import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AOrganizationComponent } from './a-organization.component';

describe('AOrganizationComponent', () => {
  let component: AOrganizationComponent;
  let fixture: ComponentFixture<AOrganizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AOrganizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
