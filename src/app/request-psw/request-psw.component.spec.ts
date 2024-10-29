import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPswComponent } from './request-psw.component';

describe('RequestPswComponent', () => {
  let component: RequestPswComponent;
  let fixture: ComponentFixture<RequestPswComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestPswComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestPswComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
