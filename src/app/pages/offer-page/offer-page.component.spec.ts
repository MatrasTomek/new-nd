import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferPageComponent } from './offer-page.component';

describe('OfferPageComponent', () => {
  let component: OfferPageComponent;
  let fixture: ComponentFixture<OfferPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OfferPageComponent]
    });
    fixture = TestBed.createComponent(OfferPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render three offer cards', () => {
    const items = fixture.nativeElement.querySelectorAll('.offer-items__item');
    expect(items.length).toBe(3);
  });

  it('should not use multiple exclamation marks in the copy', () => {
    const text = fixture.nativeElement.textContent as string;
    expect(text).not.toContain('!!!');
  });

  it('should not render a gradient text-fill page title', () => {
    const h1: HTMLElement = fixture.nativeElement.querySelector('.offer-page-wrapper__title h1');
    expect(getComputedStyle(h1).webkitBackgroundClip).not.toBe('text');
  });

  it('should not use Fira as the subtitle font', () => {
    const h3: HTMLElement = fixture.nativeElement.querySelector('.offer-page-wrapper__sub-title h3');
    expect(getComputedStyle(h3).fontFamily.toLowerCase()).not.toContain('fira');
  });

  it('should give the CTA button a background that keeps white text at WCAG AA contrast', () => {
    const button: HTMLElement = fixture.nativeElement.querySelector('.button');
    const bg = getComputedStyle(button).backgroundImage;
    // $accentGradient (#8b7bff -> #ff6fc9) measures 2.5:1-3.3:1 for white text, below the 4.5:1 AA floor
    expect(bg).not.toContain('139, 123, 255');
    expect(bg).not.toContain('255, 111, 201');
  });
});
