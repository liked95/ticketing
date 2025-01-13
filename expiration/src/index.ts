import { OrderCreatedListener } from './events/listeners/order-created-listeners'
import {natsWrapper} from './nats-wrapper'

const start = async () => {
  console.log('Expiration service starting v1...')
  try {
    if (!process.env.NATS_CLIENT_ID) {
      throw new Error('NATS_CLIENT_ID must be defined!')
    }

    if (!process.env.NATS_URL) {
      throw new Error('NATS_URL must be defined!')
    }

    if (!process.env.NATS_CLUSTER_ID) {
      throw new Error('NATS_CLUSTER_ID must be defined!')
    }

    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    )
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed')
      process.exit()
    })

    new OrderCreatedListener(natsWrapper.client).listen()
    process.on('SIGINT', () => natsWrapper.client.close())
    process.on('SIGTERM', () => natsWrapper.client.close())
  } catch (error) {
    console.error(error)
  }
}

start()
