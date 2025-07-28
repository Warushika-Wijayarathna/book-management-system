import express, {Request, Response} from 'express'
  import dotenv from 'dotenv'
  import cors from 'cors'
  import cookieParser from 'cookie-parser'
  import rootRouter from "./routes"
  import {errorHandler} from "./middlewares/errorHandler"
  import {connectDB} from "./db/mongo"

  dotenv.config()

  const app = express()

  const port = process.env.PORT || 3000

  const corsOperations = {
    origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173/',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }


  app.use(cors(corsOperations))

  app.use((req, res, next) => {
    next()
  })

  app.use(express.json())
  app.use(cookieParser())

  app.use("/api", rootRouter)
  app.use(errorHandler)

  connectDB().then(() => {
    console.log(`✅ [APP] Database connected successfully`)
    app.listen(port, () => {
      console.log(`🎯 [APP] Server is running on port ${port}`)
    })
  })
