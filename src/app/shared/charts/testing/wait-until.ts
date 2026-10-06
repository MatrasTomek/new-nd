export async function waitUntil(predicate: () => boolean, timeoutMs = 2000): Promise<void> {
	const start = Date.now();
	while (!predicate()) {
		if (Date.now() - start > timeoutMs) {
			throw new Error(`waitUntil: condition not met within ${timeoutMs} ms`);
		}
		await new Promise((resolve) => setTimeout(resolve, 20));
	}
}
