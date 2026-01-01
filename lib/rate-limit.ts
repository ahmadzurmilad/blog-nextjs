interface RateLimitStore {
    [key: string]: {
        count: number;
        resetTime: number;
    };
}

const store: RateLimitStore = {};

setInterval(
    () => {
        const now = Date.now();
        Object.keys(store).forEach((key) => {
            if (store[key].resetTime < now) {
                delete store[key];
            }
        });
    },
    10 * 60 * 1000,
);

export interface RateLimitConfig {
    interval: number;
    maxRequests: number;
}

export function rateLimit(identifier: string, config: RateLimitConfig): boolean {
    const now = Date.now();
    const record = store[identifier];

    if (!record || record.resetTime < now) {
        store[identifier] = {
            count: 1,
            resetTime: now + config.interval,
        };
        return true;
    }

    if (record.count >= config.maxRequests) {
        return false;
    }

    record.count++;
    return true;
}

export function getRateLimitInfo(identifier: string) {
    const record = store[identifier];
    if (!record || record.resetTime < Date.now()) {
        return null;
    }
    return {
        count: record.count,
        remaining: Math.max(0, record.resetTime - Date.now()),
    };
}
