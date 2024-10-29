import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AEcosistemaSmartComponent } from './a-ecosistema-smart.component';

describe('AEcosistemaSmartComponent', () => {
  let component: AEcosistemaSmartComponent;
  let fixture: ComponentFixture<AEcosistemaSmartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AEcosistemaSmartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AEcosistemaSmartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
