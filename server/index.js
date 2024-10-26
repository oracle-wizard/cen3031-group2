import express from "express"
import {createProxyMiddleware} from 'http-proxy-middleware'
import customMiddleware from './middleware/customMiddleware.js'
import cors from "cors"
const app = express()
const NEXT_PORT = 3000

app.use(cors())
app.use(customMiddleware)

app.get('/api/test', (req, res) => {
    res.send('Hello World!')
})

app.use(
    '/',
    createProxyMiddleware({
        target:`http://localhost:${NEXT_PORT}`,
        changeOrigin: true,
    })
)

const PORT = 4000

const server = app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})

const shutdown = () => {
    console.log('Shutting down server...')
    server.close(() => {
        console.log('Server closed')
        process.exit(0)
    })
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)