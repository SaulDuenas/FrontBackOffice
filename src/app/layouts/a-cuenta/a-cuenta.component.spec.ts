import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ACuentaComponent } from './a-cuenta.component';

describe('ACuentaComponent', () => {
  let component: ACuentaComponent;
  let fixture: ComponentFixture<ACuentaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ACuentaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ACuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
