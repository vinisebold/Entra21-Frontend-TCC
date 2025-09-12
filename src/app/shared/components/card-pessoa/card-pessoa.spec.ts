import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPessoa } from './card-pessoa';

describe('CardPessoa', () => {
  let component: CardPessoa;
  let fixture: ComponentFixture<CardPessoa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardPessoa],
    }).compileComponents();

    fixture = TestBed.createComponent(CardPessoa);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
