import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NavBarComponent } from './nav-bar.component';

describe('NavBarComponent', () => {
  let component: NavBarComponent;
  let fixture: ComponentFixture<NavBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, RouterModule.forRoot([])],
      declarations: [NavBarComponent]
    });
    fixture = TestBed.createComponent(NavBarComponent);
    component = fixture.componentInstance;
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.nativeElement.remove();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the logo mark as text, not the old PNG background image', () => {
    const logoEl: HTMLElement = fixture.nativeElement.querySelector('.nav-bar-wrapper__logo .logo-mark');
    expect(logoEl).toBeTruthy();
    expect(logoEl.textContent).toContain('ND');
    expect(fixture.nativeElement.querySelector('.logo-image')).toBeFalsy();
  });

  it('should render a language-switcher placeholder with no active logic', () => {
    const langSwitch: HTMLElement = fixture.nativeElement.querySelector('.nav-bar-wrapper__lang');
    expect(langSwitch).toBeTruthy();
    expect(langSwitch.getAttribute('aria-disabled')).toBe('true');
  });

  it('should cover the full viewport height when the mobile menu is open, not just the nav bar height', () => {
    component.toggleMenu();
    fixture.detectChanges();
    const menuEl: HTMLElement = fixture.nativeElement.querySelector('.menu-wrapper-items');
    const rect = menuEl.getBoundingClientRect();
    expect(rect.height).toBeGreaterThan(window.innerHeight * 0.9);
  });

  it('should not overlap page content at the top when the mobile menu is closed', () => {
    const menuEl: HTMLElement = fixture.nativeElement.querySelector('.menu-wrapper-items');
    const rect = menuEl.getBoundingClientRect();
    expect(rect.bottom).toBeLessThanOrEqual(0);
  });

  it('should expose the mobile menu toggle as an accessible, adequately sized button', () => {
    const burger: HTMLElement = fixture.nativeElement.querySelector('.menu-wrapper-burger');
    expect(burger.tagName).toBe('BUTTON');
    expect(burger.getAttribute('aria-label')).toBeTruthy();
    expect(burger.getAttribute('aria-expanded')).toBe('false');

    const rect = burger.getBoundingClientRect();
    expect(rect.width).toBeGreaterThanOrEqual(44);
    expect(rect.height).toBeGreaterThanOrEqual(44);

    component.toggleMenu();
    fixture.detectChanges();
    expect(burger.getAttribute('aria-expanded')).toBe('true');
  });
});
