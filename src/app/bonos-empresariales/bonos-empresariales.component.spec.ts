import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BonosEmpresarialesComponent } from './bonos-empresariales.component';

describe('BonosEmpresarialesComponent', () => {
  let component: BonosEmpresarialesComponent;
  let fixture: ComponentFixture<BonosEmpresarialesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BonosEmpresarialesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BonosEmpresarialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
