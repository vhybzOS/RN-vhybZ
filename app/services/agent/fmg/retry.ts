import { RetryOptions } from "./types";

export function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  const {
    retries,
    baseDelay = 100,
    maxDelay = 10000,
    timeout,
    jitter = true,
    shouldRetry = () => true,
  } = options;

  let attempts = 0;
  const start = Date.now();

  return new Promise<T>((resolve, reject) => {
    let timeoutId: NodeJS.Timeout | null = null;

    if (timeout) {
      timeoutId = setTimeout(() => {
        reject(new Error('Retry timed out'));
      }, timeout);
    }

    const attempt = async () => {
      try {
        const result = await fn();
        if (timeoutId) clearTimeout(timeoutId);
        return resolve(result);
      } catch (err) {
        attempts++;

        if (!shouldRetry(err) || attempts > retries) {
          if (timeoutId) clearTimeout(timeoutId);
          return reject(err);
        }

        const backoff = Math.min(maxDelay, baseDelay * 2 ** (attempts - 1));
        const delay = jitter ? backoff * (0.5 + Math.random() / 2) : backoff;

        if (timeout && Date.now() - start + delay > timeout) {
          return reject(new Error('Retry timed out'));
        }

        setTimeout(attempt, delay);
      }
    };

    attempt();
  });
}
