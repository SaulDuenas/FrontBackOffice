import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EcosistemaSmartComponent } from './ecosistema-smart.component';

describe('EcosistemaSmartComponent', () => {
  let component: EcosistemaSmartComponent;
  let fixture: ComponentFixture<EcosistemaSmartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcosistemaSmartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcosistemaSmartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
