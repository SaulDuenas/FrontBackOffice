import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KitVentaComponent } from './kit-venta.component';

describe('KitVentaComponent', () => {
  let component: KitVentaComponent;
  let fixture: ComponentFixture<KitVentaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KitVentaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KitVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
