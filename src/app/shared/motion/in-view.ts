const noop = () => {};

export function onFirstVisible(
	el: Element,
	callback: () => void,
	options: IntersectionObserverInit = { threshold: 0.15 },
): () => void {
	if (typeof IntersectionObserver === 'undefined') {
		callback();
		return noop;
	}
	const observer = new IntersectionObserver((entries) => {
		if (entries.some((entry) => entry.isIntersecting)) {
			observer.disconnect();
			callback();
		}
	}, options);
	observer.observe(el);
	return () => observer.disconnect();
}

export function watchVisibility(
	el: Element,
	callback: (visible: boolean) => void,
	options: IntersectionObserverInit = { threshold: 0 },
): () => void {
	if (typeof IntersectionObserver === 'undefined') {
		callback(true);
		return noop;
	}
	const observer = new IntersectionObserver((entries) => {
		const last = entries[entries.length - 1];
		if (last) {
			callback(last.isIntersecting);
		}
	}, options);
	observer.observe(el);
	return () => observer.disconnect();
}
