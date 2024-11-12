import { api } from '@/src/blitz-server'
import { rpcHandler } from '@blitzjs/rpc'

export default api(rpcHandler({ onError: console.log }))
