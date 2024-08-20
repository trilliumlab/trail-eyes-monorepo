// Adapted from https://gist.github.com/alexitaylor/c297a548db516166f7d77fb07914c79d

/**
 * Creates a cache key from fn's arguments.
 *
 * @param args Arguments from fn being memoized.
 * @returns Returns a cache key.
 */
function createCacheKeyFromArgs(args: unknown[]) {
  return args.reduce(
    (cacheKey, arg) => `${cacheKey}_${typeof arg === 'object' ? JSON.stringify(args) : `${arg}`}_`,
    '',
  ) as string;
}

/**
 * An entry in the memoization cache
 */
interface CacheEntry<T> {
  /**
   * The time the cache should be refreshed at (but the old value returned). Useful for async functions.
   */
  refreshAt?: Date;
  /**
   * The time the cache should be expired, even if a refresh has not occured.
   */
  expiresAt?: Date;
  data: T;
}

/**
 * Creates a function that memoizes the result of fn.
 * The arguments of the fn are used to create a cache key.
 *
 * @param fn The function to have its output memoized.
 * @returns Returns the memoized function.
 */
export function memoize<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn,
  {
    refreshMilliseconds,
    expiresMilliseconds,
  }: { refreshMilliseconds?: number; expiresMilliseconds?: number } = {},
) {
  const cache = new Map<string, CacheEntry<TReturn>>();

  function setCache(cacheKey: string, data: TReturn) {
    cache.set(cacheKey, {
      refreshAt: refreshMilliseconds
        ? new Date(new Date().getMilliseconds() + refreshMilliseconds)
        : undefined,
      expiresAt: expiresMilliseconds
        ? new Date(new Date().getMilliseconds() + expiresMilliseconds)
        : undefined,
      data,
    });
  }

  return (...fnArgs: TArgs) => {
    const cacheKey = createCacheKeyFromArgs(fnArgs);

    const entry = cache.get(cacheKey);
    if (entry) {
      if (entry.expiresAt && new Date().getMilliseconds() > entry.expiresAt.getMilliseconds()) {
        // Then our cache expired, so need to recall and return new result.
        // This is default behaviour
      } else if (
        entry.refreshAt &&
        new Date().getMilliseconds() > entry.refreshAt.getMilliseconds()
      ) {
        // Then our cache should be refreshed, but we can return the old result.
        const asyncFn = fn.call(undefined, ...fnArgs);
        setCache(cacheKey, asyncFn);
        return entry.data;
      } else {
        // Cache hit, so we can return cached value
        return entry.data;
      }
    }

    const asyncFn = fn.call(undefined, ...fnArgs);
    setCache(cacheKey, asyncFn);
    return asyncFn;
  };
}
