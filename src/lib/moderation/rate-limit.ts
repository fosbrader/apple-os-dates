import { createHash, randomBytes } from "node:crypto";

interface RateLimitEntry {
  attempts: number[];
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

export class SlidingWindowRateLimiter {
  private readonly entries = new Map<string, RateLimitEntry>();

  constructor(
    private readonly maximum: number,
    private readonly windowMs: number,
  ) {}

  check(key: string, now = Date.now()): RateLimitResult {
    const cutoff = now - this.windowMs;
    const attempts = (this.entries.get(key)?.attempts ?? []).filter(
      (attempt) => attempt > cutoff,
    );

    if (attempts.length >= this.maximum) {
      this.entries.set(key, { attempts });
      return {
        allowed: false,
        retryAfterSeconds: Math.max(
          1,
          Math.ceil((attempts[0] + this.windowMs - now) / 1000),
        ),
      };
    }

    attempts.push(now);
    this.entries.set(key, { attempts });

    if (this.entries.size > 2_000) {
      for (const [candidateKey, entry] of this.entries) {
        if (entry.attempts.every((attempt) => attempt <= cutoff)) {
          this.entries.delete(candidateKey);
        }
      }
    }

    return { allowed: true, retryAfterSeconds: 0 };
  }
}

const processSalt = randomBytes(24);

export function submissionRateLimitKey(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const address =
    forwardedFor ||
    headers.get("cf-connecting-ip")?.trim() ||
    headers.get("x-real-ip")?.trim() ||
    "unknown";

  return createHash("sha256")
    .update(processSalt)
    .update(address.slice(0, 128))
    .digest("hex");
}
