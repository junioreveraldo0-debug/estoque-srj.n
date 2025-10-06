
import { Redis } from '@upstash/redis';

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

export let redis = null;
if (url && token) {
  redis = new Redis({ url, token });
} else {
  // redis stays null if not configured
  redis = null;
}
