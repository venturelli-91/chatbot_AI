const WINDOW_MS = 60_000;
const MAX_REQUESTS = 20;

// Persists across HMR restarts in development via globalThis
const g = globalThis as typeof globalThis & {
	_rateLimitStore?: Map<string, { count: number; reset: number }>;
};
if (!g._rateLimitStore) g._rateLimitStore = new Map();
const store = g._rateLimitStore;

export interface RateLimitResult {
	allowed: boolean;
	retryAfter?: number;
}

export function checkRateLimit(ip: string): RateLimitResult {
	const now = Date.now();
	const entry = store.get(ip);

	if (!entry || entry.reset < now) {
		store.set(ip, { count: 1, reset: now + WINDOW_MS });
		return { allowed: true };
	}

	if (entry.count >= MAX_REQUESTS) {
		return {
			allowed: false,
			retryAfter: Math.ceil((entry.reset - now) / 1000),
		};
	}

	entry.count++;
	return { allowed: true };
}
