import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ABonosEmpresarialesComponent } from './a-bonos-empresariales.component';

describe('ABonosEmpresarialesComponent', () => {
  let component: ABonosEmpresarialesComponent;
  let fixture: ComponentFixture<ABonosEmpresarialesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ABonosEmpresarialesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ABonosEmpresarialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
