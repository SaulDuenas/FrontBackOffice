import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddaditionalplanComponent } from './addaditionalplan.component';

describe('AddaditionalplanComponent', () => {
  let component: AddaditionalplanComponent;
  let fixture: ComponentFixture<AddaditionalplanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddaditionalplanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddaditionalplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
