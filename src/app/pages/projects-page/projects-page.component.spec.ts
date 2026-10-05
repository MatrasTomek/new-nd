import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsPageComponent } from './projects-page.component';

describe('ProjectsPageComponent', () => {
  let component: ProjectsPageComponent;
  let fixture: ComponentFixture<ProjectsPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectsPageComponent]
    });
    fixture = TestBed.createComponent(ProjectsPageComponent);
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

  it('should wrap each project screenshot in a device frame', () => {
    const frames = fixture.nativeElement.querySelectorAll('.project-items__item .device-frame');
    expect(frames.length).toBe(component.projects.length);
  });

  it('should only show a live link for projects with a confirmed liveUrl', () => {
    const liveLinks = fixture.nativeElement.querySelectorAll('.project-items__item .live-link');
    const expectedCount = component.projects.filter((p) => !!p.liveUrl).length;
    expect(liveLinks.length).toBe(expectedCount);
    expect(expectedCount).toBeGreaterThan(0);
  });

  it('should not render a gradient text-fill page title', () => {
    const h1: HTMLElement = fixture.nativeElement.querySelector('.project-page-wrapper__title h1');
    expect(getComputedStyle(h1).webkitBackgroundClip).not.toBe('text');
  });

  it('should not use Fira as the subtitle font', () => {
    const h3: HTMLElement = fixture.nativeElement.querySelector('.project-page-wrapper__sub-title h3');
    expect(getComputedStyle(h3).fontFamily.toLowerCase()).not.toContain('fira');
  });

  it('should position the item description against the device frame, not the whole item, so it cannot cover the live link below it', () => {
    const frame: HTMLElement = fixture.nativeElement.querySelector('.device-frame');
    expect(getComputedStyle(frame).position).toBe('relative');
  });
});
