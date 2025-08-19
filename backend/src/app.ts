import cors from "cors"
import morgan from "morgan"
import express from "express"
import helmet from "helmet"
import authRoutes from "./routes/authRoutes"
import uploadRoutes from "./routes/uploadRoutes"
import jdRoutes from "./routes/jdRoutes"
const app = express()

app.use(helmet()) // a lib to protect against some attacks
app.use(express.json()) // to parse the JSON body.
app.use(cors())
app.use(morgan("dev"))
app.disable("x-powered-by")


app.use("/api/auth", authRoutes)
app.use("/api/upload", uploadRoutes)
app.use("/api", jdRoutes)

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });

})

export default app