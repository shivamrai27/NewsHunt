import redis from "express-redis-cache";
const redisCache = redis({
    port: 6379,
    host: "localhost",
    prefix: "advance_backend",
    //* flush the cache data after 1 hour
    expire: 60 * 60,
});

export default redisCache;