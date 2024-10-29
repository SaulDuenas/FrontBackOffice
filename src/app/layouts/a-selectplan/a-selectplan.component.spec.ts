import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ASelectplanComponent } from './a-selectplan.component';

describe('ASelectplanComponent', () => {
  let component: ASelectplanComponent;
  let fixture: ComponentFixture<ASelectplanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ASelectplanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ASelectplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
