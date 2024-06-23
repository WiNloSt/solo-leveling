import { kv } from '@vercel/kv'

export async function createLock(key: string) {
  const lockValue = Math.random()
  const isLockedAcquired = await kv.set(key, lockValue, {
    nx: true,
    ex: 10,
  })

  async function deleteLock(): Promise<number> {
    return kv.eval(
      `if redis.call("get",KEYS[1]) == ARGV[1]
     then
         return redis.call("del",KEYS[1])
     else
         return 0
     end`,
      [key],
      [lockValue]
    )
  }

  return [isLockedAcquired, deleteLock] as const
}
