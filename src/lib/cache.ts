import { unstable_cache } from "next/cache";
import { cache as reactCache } from "react";


/**
 * copy from Next/cahce unstable_cache
 * declare function unstable_cache<T extends (...args: any[]) => any>(
    cb: T,
    keys?: string[],
    options?: {
        revalidate?: number | false;
        tags?: string[];
    }
    ): T;
 * @param cb 
 * @param keyParts 
 * @param options 
 * If two components in the same render tree call getProducts() →
 * cache() ensures only one execution in-memory.
 *
 * If multiple users/requests hit the server →
 * unstable_cache() ensures Next.js serves cached data without re-fetching until revalidate.
 */
export const cache = <T extends (...args: any[]) => any>(
    cb: T, 
    keyParts? : string[], 
    options?: {
        revalidate?: number | false,
        tags?: string[]
    }) =>{
        return unstable_cache(reactCache(cb), keyParts, options)
}