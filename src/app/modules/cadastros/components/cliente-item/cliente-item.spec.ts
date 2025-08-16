import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteItem } from './cliente-item';

describe('ClienteItem', () => {
  let component: ClienteItem;
  let fixture: ComponentFixture<ClienteItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClienteItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
