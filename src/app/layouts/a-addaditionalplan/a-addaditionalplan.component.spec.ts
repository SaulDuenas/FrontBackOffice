import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AAddaditionalplanComponent } from './a-addaditionalplan.component';

describe('AAddaditionalplanComponent', () => {
  let component: AAddaditionalplanComponent;
  let fixture: ComponentFixture<AAddaditionalplanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AAddaditionalplanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AAddaditionalplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
