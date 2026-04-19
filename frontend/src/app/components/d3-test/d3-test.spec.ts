import { ComponentFixture, TestBed } from '@angular/core/testing';

import { D3Test } from './d3-test';

describe('D3Test', () => {
  let component: D3Test;
  let fixture: ComponentFixture<D3Test>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [D3Test],
    }).compileComponents();

    fixture = TestBed.createComponent(D3Test);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
