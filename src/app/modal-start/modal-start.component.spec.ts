import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalStartComponent } from './modal-start.component';

describe('ModalStartComponent', () => {
  let component: ModalStartComponent;
  let fixture: ComponentFixture<ModalStartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalStartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
