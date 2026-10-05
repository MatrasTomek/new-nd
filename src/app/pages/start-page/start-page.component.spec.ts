import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';

import { StartPageComponent } from './start-page.component';

describe('StartPageComponent', () => {
  let component: StartPageComponent;
  let fixture: ComponentFixture<StartPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [StartPageComponent]
    });
    fixture = TestBed.createComponent(StartPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not render a gradient text-fill heading in the hero', () => {
    const h1: HTMLElement = fixture.nativeElement.querySelector('.start-page-wrapper__title h1');
    expect(getComputedStyle(h1).webkitBackgroundClip).not.toBe('text');
  });

  it('should render offer cards without stock videos', () => {
    const videos = fixture.nativeElement.querySelectorAll('.start-page-wrapper__offer video');
    expect(videos.length).toBe(0);
    const icons = fixture.nativeElement.querySelectorAll('.start-page-wrapper__offer .offer__item .pi');
    expect(icons.length).toBe(4);
  });

  it('should render trust section as icon cards without background photos', () => {
    const images = fixture.nativeElement.querySelectorAll('.trust-image');
    expect(images.length).toBe(0);
    const cards = fixture.nativeElement.querySelectorAll('.start-page-wrapper__trust .trust__item');
    expect(cards.length).toBe(4);
  });

  it('should render 4 process steps', () => {
    const steps = fixture.nativeElement.querySelectorAll('.process-section .process-step');
    expect(steps.length).toBe(4);
    expect(steps[0].textContent).toContain('Brief');
  });

  it('should render testimonial placeholders without fabricated quotes', () => {
    const cards = fixture.nativeElement.querySelectorAll('.testimonials-section .testimonial-card');
    expect(cards.length).toBeGreaterThanOrEqual(2);
    cards.forEach((card: HTMLElement) => {
      expect(card.textContent).toContain('uzupełni');
    });
  });
});
