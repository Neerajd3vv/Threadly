import express from "express"
import cors from "cors"
import morgan from "morgan"

const app = express()
app.use(cors())
app.use(morgan("dev"))

app.get("/", (req, res) => {
    res.send("hello from server!")
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);

})

