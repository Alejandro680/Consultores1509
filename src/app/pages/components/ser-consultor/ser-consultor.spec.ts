import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerConsultor } from './ser-consultor';

describe('SerConsultor', () => {
  let component: SerConsultor;
  let fixture: ComponentFixture<SerConsultor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SerConsultor],
    }).compileComponents();

    fixture = TestBed.createComponent(SerConsultor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
