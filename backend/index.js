import express from 'express';
import hostname from "os";
import cors from 'cors';
import {router} from "./routes/index.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`Request from ${req.url} ${req.hostname}`);
    next();
})
app.use('/api/v1', router);


app.listen(PORT, hostname, (req, res)=> {
    console.log(`Listening on ${hostname} at ${PORT}`);
});






