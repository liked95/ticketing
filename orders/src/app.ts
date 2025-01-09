import {errorHandler, getCurrentUser, NotFoundError} from '@sonnytickets/common'

import cookieSession from 'cookie-session'
import express from 'express'
import 'express-async-errors'
import {indexOrderRouter} from './routes'
import {newOrderRouter} from './routes/new'
import {deleteOrderRouter} from './routes/delete'
import {showOrderRouter} from './routes/show'
import morgan from 'morgan'

const app = express()

app.set('trust proxy', true)
app.use(morgan('dev'))

app.use(express.json())
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
)

app.use(getCurrentUser)
app.use(indexOrderRouter)
app.use(newOrderRouter)
app.use(deleteOrderRouter)
app.use(showOrderRouter)

app.all('*', async (req, res, next) => {
  throw new NotFoundError()
})

// @ts-ignore
app.use(errorHandler)

export {app}
