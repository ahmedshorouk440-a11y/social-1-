"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisServices = exports.RedisService = void 0;
const redis_1 = require("redis");
const configService_1 = require("../Config/configService");
class RedisService {
    client;
    constructor() {
        this.client = (0, redis_1.createClient)({
            url: configService_1.env.REDIS_URL,
        });
        this.handleConnection();
    }
    handleConnection() {
        this.client.on('error', error => {
            console.log('error');
        });
    }
    connect() {
        this.client.connect();
        console.log('REDIS CONNECTED');
    }
    set(key, value, EX) {
        return this.client.set(key, value, { EX: EX });
    }
    ;
    get(key) {
        return this.client.get(key);
    }
    ;
    exists(key) {
        return this.client.exists(key);
    }
    ;
    update(key, value, ttl) {
        return this.client.set(key, value, ttl ? { EX: ttl } : undefined);
    }
    del(key) {
        return this.client.del(key);
    }
    ;
    ttl(key) {
        return this.client.ttl(key);
    }
    ;
    expire(key, ttl) {
        return this.client.expire(key, ttl);
    }
    ;
    incrBy(key, value = 1) {
        return this.client.incrBy(key, value);
    }
    ;
}
exports.RedisService = RedisService;
exports.redisServices = new RedisService();
