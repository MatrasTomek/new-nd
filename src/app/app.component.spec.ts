import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';

describe('AppComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [SharedModule, RouterModule.forRoot([])],
    declarations: [AppComponent]
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'new-nd'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('new-nd');
  });

  it('should wrap the routed page in a main landmark that reserves the viewport (no layout shift on lazy routes)', () => {
    const fixture = TestBed.createComponent(AppComponent);
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();
    const main = (fixture.nativeElement as HTMLElement).querySelector('main');
    expect(main?.querySelector('router-outlet')).toBeTruthy();
    const style = getComputedStyle(main!);
    expect(style.display).toBe('flow-root');
    expect(main!.getBoundingClientRect().height).toBeGreaterThanOrEqual(window.innerHeight);
    fixture.nativeElement.remove();
  });

  it('should render the shared navigation and footer around the routed page', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-nav-bar')).toBeTruthy();
    expect(compiled.querySelector('app-footer')).toBeTruthy();
  });
});
