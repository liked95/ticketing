import {json} from 'body-parser'
import cookieSession from 'cookie-session'
import express from 'express'
import 'express-async-errors'
import {errorHandler, NotFoundError} from '@sonnytickets/common'
import {currentUserRouter} from './routes/current-user'
import {signinRouter} from './routes/signin'
import {signoutRouter} from './routes/signout'
import {signupRouter} from './routes/signup'
import morgan from 'morgan'

const app = express()

app.set('trust proxy', true)
app.use(morgan('dev'))
app.use(json())
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
)
app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)

app.all('*', async (req, res, next) => {
  throw new NotFoundError()
})

// @ts-ignore
app.use(errorHandler)

export {app}
