import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TypewriterComponent } from './typewriter.component';
import { provideMotionStub } from './testing/motion-testing';

@Component({
	standalone: true,
	imports: [TypewriterComponent],
	template: `<h3 style="width:200px;margin:0;font:16px/1.5 monospace">
		Tworzymy nowoczesne <app-typewriter [words]="['strony internetowe']" [typeDelay]="10" [holdDelay]="1000"></app-typewriter>
	</h3>`,
})
class HeadingHostComponent {}

describe('TypewriterComponent layout', () => {
	it('reserves its own line so typing never changes the heading height (no layout shift)', fakeAsync(() => {
		TestBed.configureTestingModule({ imports: [HeadingHostComponent], providers: [provideMotionStub(false)] });
		const fixture = TestBed.createComponent(HeadingHostComponent);
		document.body.appendChild(fixture.nativeElement);
		fixture.detectChanges();
		const heading: HTMLElement = fixture.nativeElement.querySelector('h3');
		const emptyHeight = heading.offsetHeight;
		tick(10 * 'strony internetowe'.length);
		fixture.detectChanges();
		expect(heading.offsetHeight).toBe(emptyHeight);
		fixture.destroy();
		fixture.nativeElement.remove();
	}));
});

describe('TypewriterComponent', () => {
	function create(reduced: boolean) {
		TestBed.configureTestingModule({ imports: [TypewriterComponent], providers: [provideMotionStub(reduced)] });
		const fixture = TestBed.createComponent(TypewriterComponent);
		fixture.componentRef.setInput('words', ['ab', 'cd']);
		fixture.componentRef.setInput('typeDelay', 10);
		fixture.componentRef.setInput('deleteDelay', 5);
		fixture.componentRef.setInput('holdDelay', 50);
		fixture.detectChanges();
		return fixture;
	}

	it('types, holds, deletes and moves to the next word', fakeAsync(() => {
		const fixture = create(false);
		const text = fixture.componentInstance.text;
		tick(10);
		expect(text()).toBe('a');
		tick(10);
		expect(text()).toBe('ab');
		tick(49);
		expect(text()).toBe('ab');
		tick(1);
		expect(text()).toBe('a');
		tick(5);
		expect(text()).toBe('');
		tick(5);
		expect(text()).toBe('c');
		fixture.destroy();
	}));

	it('exposes all words to screen readers and hides the animated text', () => {
		const fixture = create(true);
		const hidden: HTMLElement = fixture.nativeElement.querySelector('.visually-hidden');
		const animated: HTMLElement = fixture.nativeElement.querySelector('.typewriter');
		expect(hidden.textContent).toBe('ab, cd');
		expect(animated.getAttribute('aria-hidden')).toBe('true');
	});

	it('shows the first word without animation when motion is reduced', fakeAsync(() => {
		const fixture = create(true);
		expect(fixture.componentInstance.text()).toBe('ab');
		tick(1000);
		expect(fixture.componentInstance.text()).toBe('ab');
	}));

	it('clears its timer on destroy', fakeAsync(() => {
		const fixture = create(false);
		tick(10);
		fixture.destroy();
		tick(1000);
	}));
});
