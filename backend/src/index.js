import "dotenv/config"
import express  from "express";
const app = express();
import cors from "cors";
import rotas from "./router/router.js"

app.use(cors());
app.use(express.json());
app.use(rotas);

const port = process.env.PORT || 3001

app.listen(port, () => console.log(`Server running in http://localhost:${port}`))

