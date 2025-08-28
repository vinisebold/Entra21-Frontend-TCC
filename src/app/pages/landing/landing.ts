import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  Renderer2,
  inject,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Landing implements AfterViewInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly r2 = inject(Renderer2);
  private sparkleCleanup?: () => void;

  ngAfterViewInit(): void {
    this.setupMobileMenu();
    this.setupRipple();
    this.setupLogoLightFollow();
    this.sparkleCleanup = this.setupSparkles();
  }

  ngOnDestroy(): void {
    if (this.sparkleCleanup) {
      this.sparkleCleanup();
    }
  }

  private setupMobileMenu() {
    const root = this.el.nativeElement;
    const menuBtn = root.querySelector('#menuBtn') as HTMLButtonElement | null;
    const mobileMenu = root.querySelector('#mobileMenu') as HTMLElement | null;
    if (!menuBtn || !mobileMenu) return;

    const toggle = () => {
      const isHidden = mobileMenu.classList.toggle('hidden');
      this.r2.setAttribute(menuBtn, 'aria-expanded', String(!isHidden));
    };
    const close = () => {
      mobileMenu.classList.add('hidden');
      this.r2.setAttribute(menuBtn, 'aria-expanded', 'false');
    };

    this.r2.listen(menuBtn, 'click', toggle);
    mobileMenu
      .querySelectorAll('a')
      .forEach((a: Element) => this.r2.listen(a, 'click', close));
  }

  private setupRipple() {
    const root = this.el.nativeElement;
    root.querySelectorAll('[data-ripple]').forEach((btn: Element) => {
      this.r2.listen(btn, 'click', (e: MouseEvent) => {
        const rect = (btn as HTMLElement).getBoundingClientRect();
        const d = Math.max(rect.width, rect.height);
        const circle = this.r2.createElement('span');
        circle.className = 'ripple-effect';
        circle.style.width = circle.style.height = d + 'px';
        circle.style.left = e.clientX - rect.left - d / 2 + 'px';
        circle.style.top = e.clientY - rect.top - d / 2 + 'px';
        this.r2.appendChild(btn as HTMLElement, circle);
        setTimeout(() => this.r2.removeChild(btn as HTMLElement, circle), 650);
      });
    });
  }

  private setupLogoLightFollow() {
    const root = this.el.nativeElement;
    const logoBg = root.querySelector('#logo-bg') as HTMLElement | null;
    if (!logoBg) return;
    const handler = (e: MouseEvent) => {
      const radius = 220;
      const x = e.clientX;
      const y = e.clientY;
      (
        logoBg.style as any
      ).maskImage = `radial-gradient(circle ${radius}px at ${x}px ${y}px, white 0%, transparent 100%)`;
      (
        logoBg.style as any
      ).webkitMaskImage = `radial-gradient(circle ${radius}px at ${x}px ${y}px, white 0%, transparent 100%)`;
    };
    this.r2.listen(document, 'mousemove', handler);
  }

  private setupSparkles() {
    const root = this.el.nativeElement;
    const canvas = root.querySelector(
      '#sparkle-canvas'
    ) as HTMLCanvasElement | null;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let dpr = Math.max(1, window.devicePixelRatio || 1);
    let animationId: number;

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    window.addEventListener('resize', resize);
    resize();

    // Sistema de partículas otimizado
    const STAR_COUNT = 200; // Reduzido para melhor performance
    const TRAIL_LENGTH = 5;

    interface Sparkle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      alpha: number;
      fade: number;
      direction: number;
      speed: number;
      hue: number;
      trail: Array<{ x: number; y: number; alpha: number }>;
      magnetism: number;
      twinkle: number;
      twinkleSpeed: number;
    }

    const stars: Sparkle[] = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: 0,
      vy: 0,
      r: 0.8 + Math.random() * 2.2,
      alpha: 0.3 + Math.random() * 0.7,
      fade: Math.random() * 0.015 + 0.008,
      direction: Math.random() < 0.5 ? 1 : -1,
      speed: 0.025 + Math.random() * 0.045, // Aumentada a velocidade
      hue: 120 + Math.random() * 60, // Verde para amarelo esverdeado
      trail: [],
      magnetism: 0.8 + Math.random() * 1.2, // Aumentado o magnetismo
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.02 + Math.random() * 0.03,
    }));

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let mouseActive = false;
    let mouseVelocityX = 0;
    let mouseVelocityY = 0;
    let lastMouseX = mouseX;
    let lastMouseY = mouseY;
    let mouseInDocument = true; // Controle de estado do mouse

    const onMove = (e: MouseEvent) => {
      mouseVelocityX = e.clientX - lastMouseX;
      mouseVelocityY = e.clientY - lastMouseY;
      lastMouseX = mouseX;
      lastMouseY = mouseY;
      mouseX = e.clientX;
      mouseY = e.clientY;
      mouseActive = true;
      mouseInDocument = true;
    };

    const onLeave = () => {
      mouseActive = false;
      mouseInDocument = false;
      // Parar todas as estrelas imediatamente quando mouse sai
      for (const s of stars) {
        s.vx = 0;
        s.vy = 0;
      }
    };

    const onEnter = () => {
      mouseInDocument = true;
      // Não ativar mouseActive imediatamente, só quando mouse se mover
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter, { passive: true });

    // Cores otimizadas
    const colors = [
      'rgba(255, 255, 255, ', // Branco puro
      'rgba(220, 255, 220, ', // Verde muito claro
      'rgba(240, 255, 240, ', // Branco esverdeado
      'rgba(200, 255, 200, ', // Verde claro
      'rgba(230, 255, 230, ', // Branco com toque verde
    ];

    // Fade gradual do canvas para efeito de trail mais suave
    const draw = () => {
      // Fade mais forte para evitar trails muito longos em alta velocidade
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (const s of stars) {
        // Atualizar trail
        s.trail.unshift({ x: s.x, y: s.y, alpha: s.alpha });
        if (s.trail.length > TRAIL_LENGTH) {
          s.trail.pop();
        }

        // Física de movimento aprimorada
        if (mouseActive && mouseInDocument) {
          const dx = mouseX - s.x;
          const dy = mouseY - s.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 300; // Aumentada a área de influência

          if (dist < maxDist && dist > 0) {
            const force = (1 - dist / maxDist) * s.magnetism;
            const normalizedDx = dx / dist;
            const normalizedDy = dy / dist;

            s.vx += normalizedDx * force * 1.2; // Aumentada a força
            s.vy += normalizedDy * force * 1.2;

            // Adicionar influência da velocidade do mouse
            s.vx += mouseVelocityX * 0.03;
            s.vy += mouseVelocityY * 0.03;
          }

          // Remover movimento quando longe do mouse - estrelas ficam paradas
        } else {
          // Movimento natural quando mouse inativo - apenas desaceleração
          s.x += s.vx;
          s.y += s.vy;
          s.vx *= 0.96; // Atrito mais forte para parar as estrelas
          s.vy *= 0.96;

          // Remover movimento browniano - estrelas param quando mouse inativo
        }

        // Limitar velocidade máxima para evitar dots visíveis
        const maxVelocity = 26;
        const currentVelocity = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
        if (currentVelocity > maxVelocity) {
          s.vx = (s.vx / currentVelocity) * maxVelocity;
          s.vy = (s.vy / currentVelocity) * maxVelocity;
        }

        // Aplicar movimento
        s.x += s.vx * s.speed;
        s.y += s.vy * s.speed;

        // Wrap around screen com transição suave
        const margin = 50;
        if (s.x < -margin) s.x = window.innerWidth + margin;
        if (s.x > window.innerWidth + margin) s.x = -margin;
        if (s.y < -margin) s.y = window.innerHeight + margin;
        if (s.y > window.innerHeight + margin) s.y = -margin;

        // Efeito twinkle aprimorado
        s.twinkle += s.twinkleSpeed;
        const twinkleAlpha = 0.3 + (Math.sin(s.twinkle) * 0.4 + 0.4) * 0.7;

        // Pulso de alpha
        s.alpha += s.fade * s.direction;
        if (s.alpha <= 0.2 || s.alpha >= 1) {
          s.direction *= -1;
        }

        const finalAlpha = Math.min(s.alpha * twinkleAlpha, 1);

        // Desenhar trail com fade (menos trail em alta velocidade)
        const velocityFactor = Math.min(currentVelocity / 6, 1); // Quanto mais rápido, menos trail
        s.trail.forEach((point, index) => {
          const trailAlpha =
            finalAlpha *
            (1 - index / TRAIL_LENGTH) *
            0.6 *
            (1 - velocityFactor * 0.5);
          if (trailAlpha > 0.02) {
            const colorIndex = Math.floor(((s.hue - 120) / 60) * colors.length);
            const color = colors[Math.min(colorIndex, colors.length - 1)];

            ctx.fillStyle = color + trailAlpha + ')';
            ctx.beginPath();
            ctx.arc(
              point.x,
              point.y,
              s.r * (0.5 + (1 - index / TRAIL_LENGTH) * 0.5),
              0,
              Math.PI * 2
            );
            ctx.fill();
          }
        });

        // Desenhar sparkle principal com glow
        const colorIndex = Math.floor(((s.hue - 120) / 60) * colors.length);
        const color = colors[Math.min(colorIndex, colors.length - 1)];

        // Glow exterior
        ctx.shadowColor = `hsl(${s.hue}, 70%, 80%)`;
        ctx.shadowBlur = 8 + Math.sin(s.twinkle) * 4;
        ctx.fillStyle = color + finalAlpha + ')';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();

        // Core brilhante
        ctx.shadowBlur = 2;
        ctx.fillStyle = `rgba(255, 255, 255, ${finalAlpha * 0.8})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.shadowBlur = 0;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    // Cleanup function
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      window.removeEventListener('resize', resize);
    };
  }
}
