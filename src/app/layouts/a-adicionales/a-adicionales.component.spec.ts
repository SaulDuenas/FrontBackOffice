import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AAdicionalesComponent } from './a-adicionales.component';

describe('AAdicionalesComponent', () => {
  let component: AAdicionalesComponent;
  let fixture: ComponentFixture<AAdicionalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AAdicionalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AAdicionalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
