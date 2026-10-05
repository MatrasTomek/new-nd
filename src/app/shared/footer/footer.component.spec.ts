import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FooterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not use Fira as the primary font for footer links', () => {
    const linkEl: HTMLElement = fixture.nativeElement.querySelector('.page-footer-wrapper__links a');
    const fontFamily = getComputedStyle(linkEl).fontFamily;
    expect(fontFamily.toLowerCase()).not.toContain('fira');
  });

  it('should style the email link in the address block, not leave it at the browser default blue', () => {
    const emailLink: HTMLElement = fixture.nativeElement.querySelector('.page-footer-wrapper__adress a');
    const color = getComputedStyle(emailLink).color;
    expect(color).not.toBe('rgb(0, 0, 238)');
  });
});
