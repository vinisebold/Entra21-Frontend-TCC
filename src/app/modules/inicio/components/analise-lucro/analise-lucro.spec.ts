import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AnaliseLucro } from './analise-lucro';
import { AnaliseService } from '../../services/analise.service';

describe('AnaliseLucro', () => {
  let component: AnaliseLucro;
  let fixture: ComponentFixture<AnaliseLucro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnaliseLucro],
      providers: [
        {
          provide: AnaliseService,
          useValue: { getLucro: () => of({ totalLucro: 0 }) },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnaliseLucro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
