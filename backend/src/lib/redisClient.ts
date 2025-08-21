import { createClient } from "redis";

export const redis = createClient({
    url: process.env.REDIS_URL
});

redis.on("error", (err) => {
    console.error("Redis Client Error:", err);
});

(async () => {
    try {
        await redis.connect();
    } catch (err) {
        console.error("❌ Redis connection failed:", err);
    }
})();
