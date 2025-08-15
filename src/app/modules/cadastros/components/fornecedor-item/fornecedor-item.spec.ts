import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FornecedorItem } from './fornecedor-item';

describe('FornecedorItem', () => {
  let component: FornecedorItem;
  let fixture: ComponentFixture<FornecedorItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FornecedorItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FornecedorItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
