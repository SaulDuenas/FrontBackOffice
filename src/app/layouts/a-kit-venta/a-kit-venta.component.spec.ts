import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AKitVentaComponent } from './a-kit-venta.component';

describe('AKitVentaComponent', () => {
  let component: AKitVentaComponent;
  let fixture: ComponentFixture<AKitVentaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AKitVentaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AKitVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
