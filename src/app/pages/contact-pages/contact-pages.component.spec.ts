import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { ContactPagesComponent } from './contact-pages.component';

describe('ContactPagesComponent', () => {
  let component: ContactPagesComponent;
  let fixture: ComponentFixture<ContactPagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ContactPagesComponent]
    });
    fixture = TestBed.createComponent(ContactPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not use the harbour-city stock photo as background', () => {
    const bgEl: HTMLElement = fixture.nativeElement.querySelector('.contact-page-wrapper__background');
    const bgImage = getComputedStyle(bgEl).backgroundImage;
    expect(bgImage).not.toContain('harbour-city');
  });

  it('should render form labels in a light color readable on the dark glass panel', () => {
    const labelEl: HTMLElement = fixture.nativeElement.querySelector('.input-group label');
    const color = getComputedStyle(labelEl).color;
    expect(color).not.toBe('rgb(4, 5, 31)');
  });

  it('should render the RODO consent link at readable contrast on the dark glass panel', () => {
    const link: HTMLElement = fixture.nativeElement.querySelector('.checkbox-label a');
    const color = getComputedStyle(link).color;
    // $coldColor (#443bf6) on the dark panel measures ~3:1, below the 4.5:1 AA floor
    expect(color).not.toBe('rgb(68, 59, 246)');
  });

  it('should render the success message at readable contrast on the dark glass panel', () => {
    component.isSubmitted = true;
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement.querySelector('.success-message');
    const color = getComputedStyle(el).color;
    // darken($isDoneBox, 20%) = #215200 measures ~2:1 against the dark panel, below the 4.5:1 AA floor
    expect(color).not.toBe('rgb(33, 82, 0)');
  });
});
