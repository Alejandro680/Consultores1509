import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasSobreNosostros } from './sobre-nosostros';

describe('MasSobreNosostros', () => {
  let component: MasSobreNosostros;
  let fixture: ComponentFixture<MasSobreNosostros>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasSobreNosostros],
    }).compileComponents();

    fixture = TestBed.createComponent(MasSobreNosostros);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
