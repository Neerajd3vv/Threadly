import cors from "cors"
import morgan from "morgan"
import express from "express"
import authRoutes from "./routes/authRoutes"
const app = express()

app.use(express.json()) // to parse the JSON body.
app.use(cors())
app.use(morgan("dev"))


app.use("/api/auth", authRoutes)

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });

})

export default app