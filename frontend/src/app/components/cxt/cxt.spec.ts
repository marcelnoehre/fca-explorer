import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cxt } from './cxt';

describe('Cxt', () => {
  let component: Cxt;
  let fixture: ComponentFixture<Cxt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cxt],
    }).compileComponents();

    fixture = TestBed.createComponent(Cxt);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
