import { createClient, RedisClientType } from 'redis';
import { env } from '../Config/configService';

export class RedisService {
  private client: RedisClientType;

  constructor() {
    this.client = createClient({
      url: env.REDIS_URL,
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


 set(key:string , value:string , EX:number){
  
  return this.client.set(key , value , {EX:EX})
};


 get(key:string){
 return this.client.get(key);
 };

exists(key:string){
  return this.client.exists(key);
};

update(key: string, value: string, ttl?: number) {
  return this.client.set(key, value, ttl ? { EX: ttl } : undefined);
}

del(key:string){
  return this.client.del(key);
};
 ttl  (key:string ) {
  return this.client.ttl(key);
};
expire (key:string , ttl:number){
  return this.client.expire(key , ttl);
};
incrBy (key:string, value = 1){
  return this.client.incrBy(key, value);
};










}
export const redisServices = new RedisService()
