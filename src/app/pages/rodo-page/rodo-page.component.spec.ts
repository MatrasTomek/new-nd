import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RodoPageComponent } from './rodo-page.component';

describe('RodoPageComponent', () => {
  let component: RodoPageComponent;
  let fixture: ComponentFixture<RodoPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RodoPageComponent]
    });
    fixture = TestBed.createComponent(RodoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the RODO info text in a light color readable on the dark page body', () => {
    const el: HTMLElement = fixture.nativeElement.querySelector('.rodo-info .rodo-text');
    const color = getComputedStyle(el).color;
    // #04051f (the original dark-on-light color) would be unreadable on the now-dark page body
    expect(color).not.toBe('rgb(4, 5, 31)');
  });
});
