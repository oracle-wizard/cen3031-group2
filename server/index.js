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

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})
