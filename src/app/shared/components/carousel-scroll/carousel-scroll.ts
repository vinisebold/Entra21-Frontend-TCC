import {
  Component,
  ChangeDetectionStrategy,
  afterNextRender,
  inject,
  Renderer2,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

interface CarouselItemConfig {
  x: number;
  y: number;
  scale: number;
  opacity: number;
}

interface ViewportConfig {
  [key: string]: CarouselItemConfig[];
}

@Component({
  selector: 'app-carousel-scroll',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './carousel-scroll.html',
  styleUrl: './carousel-scroll.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarouselScroll implements OnDestroy {
  private readonly renderer = inject(Renderer2);
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  private scrollListener?: () => void;
  private resizeListener?: () => void;
  private intersectionObserver?: IntersectionObserver;
  private animationFrameId?: number;

  private viewport = { width: 0, height: 0 };
  private top = 0;
  private height = 0;
  private ratio = 0;
  private offset: number | null = null;
  private wrapperOffset = 0;

  // Configurações exatas do Google Chrome (100% fidelidade)
  private readonly CONFIG: ViewportConfig = {
    desktop: [
      { x: 25.5, y: -22, scale: 1, opacity: 1 },
      { x: 0, y: 50, scale: 1, opacity: 0 },
      { x: 0, y: 8, scale: 1.15, opacity: 1 },
      { x: 44, y: -26, scale: 1.25, opacity: 1 },
      { x: 23, y: 10, scale: 1, opacity: 1 },
    ],
    largeDesktop: [
      { x: 23, y: -22, scale: 1, opacity: 1 },
      { x: 0, y: 50, scale: 1, opacity: 0 },
      { x: 0, y: 8, scale: 1.15, opacity: 1 },
      { x: 52, y: -26, scale: 1.25, opacity: 1 },
      { x: 24, y: 10, scale: 1, opacity: 1 },
    ],
    mobile: [
      { x: 0, y: 0, scale: 1, opacity: 1 },
      { x: 0, y: 25, scale: 1, opacity: 0.7 },
      { x: 0, y: 12, scale: 1.1, opacity: 1 },
      { x: 20, y: -15, scale: 1.15, opacity: 1 },
      { x: 15, y: 8, scale: 1, opacity: 1 },
    ],
  };

  private carouselTrack?: HTMLElement;
  private carouselItems: Element[] = [];
  private itemProps: (CarouselItemConfig & { el: Element })[] = [];

  constructor() {
    afterNextRender(() => {
      this.initScrollEffect();
    });
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  private cleanup(): void {
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
      window.removeEventListener('wheel', this.scrollListener);
      this.scrollListener = undefined;
    }

    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
      this.resizeListener = undefined;
    }

    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = undefined;
    }

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }
  }

  private initScrollEffect(): void {
    const elements = this.getRequiredElements();
    if (!elements) return;

    const { carouselTrack } = elements;
    this.carouselTrack = carouselTrack;
    this.carouselItems = Array.from(
      carouselTrack.querySelectorAll('.carousel-item')
    );

    this.updateSizes();
    this.prepareItemProps();

    this.resizeListener = () => this.onResize();
    window.addEventListener('resize', this.resizeListener);

    // Intersection Observer para otimização
    try {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.attachScrollListeners();
            } else {
              this.detachScrollListeners();
            }
          });
        },
        { rootMargin: '0px', threshold: 0 }
      );

      if (this.isDesktopView()) {
        this.intersectionObserver.observe(this.elementRef.nativeElement);
      }
    } catch (e) {
      // Fallback: sempre anexar listeners
      this.attachScrollListeners();
    }

    // Aplicar estado inicial
    requestAnimationFrame(() => {
      this.elementRef.nativeElement.classList.add('is-loaded');
      this.apply(0);
    });
  }

  private getRequiredElements(): { carouselTrack: HTMLElement } | null {
    const host = this.elementRef.nativeElement;
    const carouselTrack = host.querySelector(
      '#carousel-track'
    ) as HTMLElement | null;

    if (!carouselTrack) {
      console.warn('CarouselScroll: #carousel-track element not found');
      return null;
    }

    return { carouselTrack };
  }

  private attachScrollListeners(): void {
    if (this.scrollListener) return;

    this.scrollListener = () => this.onScroll();
    window.addEventListener('scroll', this.scrollListener, { passive: true });
    window.addEventListener('wheel', this.scrollListener, { passive: true });
  }

  private detachScrollListeners(): void {
    if (!this.scrollListener) return;

    window.removeEventListener('scroll', this.scrollListener);
    window.removeEventListener('wheel', this.scrollListener);
    this.scrollListener = undefined;
  }

  private updateSizes(): void {
    this.viewport = {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
    };

    const rect = this.elementRef.nativeElement.getBoundingClientRect();
    this.top = rect.top + (window.pageYOffset || window.scrollY);
    this.height = rect.height || rect.bottom - rect.top;
  }

  private prepareItemProps(): void {
    const bp = this.getBreakpoint();
    const configs = this.CONFIG[bp] || this.CONFIG['desktop'];

    this.itemProps = this.carouselItems.map((el, i) => ({
      el,
      ...(configs[i] || { x: 0, y: 0, scale: 1, opacity: 1 }),
    }));
  }

  private getBreakpoint(): string {
    const width = this.viewport.width || window.innerWidth;
    if (width < 1024) return 'mobile';
    if (width >= 1440) return 'largeDesktop';
    return 'desktop';
  }

  private isDesktopView(): boolean {
    const bp = this.getBreakpoint();
    return bp === 'desktop' || bp === 'largeDesktop';
  }

  private computeOffset(): number {
    if (this.offset !== null) return this.offset;

    const scrollY = window.pageYOffset || window.scrollY;
    this.offset = Math.max(
      0,
      Math.min(
        1,
        (this.viewport.height - (this.top - scrollY)) /
          (this.viewport.height + (this.height || 0))
      )
    );

    return this.offset;
  }

  private computeRatio(): number {
    const scrollY = window.pageYOffset || window.scrollY;
    this.updateSizes();

    const raw = Math.max(
      0,
      Math.min(
        1,
        (this.viewport.height - (this.top - scrollY)) /
          (this.viewport.height + this.height)
      )
    );

    const off = this.computeOffset() || 0;
    const normalized = off >= 1 ? 1 : (raw - off) / (1 - off);

    return Math.max(0, Math.min(1, isNaN(normalized) ? 0 : normalized));
  }

  private onScroll(): void {
    if (this.animationFrameId) return;

    this.animationFrameId = requestAnimationFrame(() => {
      const r = this.computeRatio();
      this.ratio = r;
      this.apply(r);
      this.animationFrameId = undefined;
    });
  }

  private onResize(): void {
    this.updateSizes();
    this.prepareItemProps();

    // Computar wrapper translateX se houver
    if (this.carouselTrack) {
      const style = window.getComputedStyle(this.carouselTrack);
      const transform = style.transform || style.webkitTransform || 'none';

      if (transform && transform !== 'none') {
        try {
          const matrix = transform.match(/matrix.*\((.+)\)/);
          if (matrix) {
            const values = matrix[1].split(', ');
            this.wrapperOffset = parseFloat(values[4]) || 0;
          }
        } catch (e) {
          this.wrapperOffset = 0;
        }
      } else {
        this.wrapperOffset = 0;
      }
    }

    this.onScroll();
  }

  private apply(r: number): void {
    // Fase 1: 0..0.25 => transformações dos itens
    const p1 = Math.min(1, Math.max(0, r / 0.25));

    // Fase 2: 0.25..1 => translação do wrapper
    const p2 = r <= 0.25 ? 0 : Math.min(1, (r - 0.25) / (1 - 0.25));

    // Aplicar transformações dos itens
    this.itemProps.forEach((prop) => {
      const e = prop.x || 0;
      const f = prop.y || 0;
      const k = prop.scale || 1;
      const n = prop.opacity || 1;

      const d = Math.abs(e) * p1;
      const t = Math.abs(f) * p1;
      const newX = e < 0 ? e + d : e - d;
      const newY = f < 0 ? f + t : f - t;
      const scale = k - (k - 1) * p1;
      const opacity = n + Math.abs(n - 1) * p1;

      try {
        this.renderer.setStyle(
          prop.el,
          'transform',
          `translate(${newX}%, ${newY}%) scale(${scale})`
        );
        this.renderer.setStyle(prop.el, 'opacity', opacity.toString());
      } catch (e) {
        console.warn('Erro ao aplicar transformação:', e);
      }
    });

    // Aplicar translação do wrapper
    if (this.carouselTrack) {
      try {
        const translateX = -250 * p2 + (this.wrapperOffset || 0);
        this.renderer.setStyle(
          this.carouselTrack,
          'transform',
          `translate(${translateX}px, 0)`
        );
      } catch (e) {
        console.warn('Erro ao aplicar translação do wrapper:', e);
      }
    }
  }
}
