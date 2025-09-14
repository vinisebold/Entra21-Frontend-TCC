import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselScroll } from './carousel-scroll';

describe('CarouselScroll', () => {
  let component: CarouselScroll;
  let fixture: ComponentFixture<CarouselScroll>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarouselScroll]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarouselScroll);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
