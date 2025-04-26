// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();
// const connectDB = require('./config/connectDB');
// const router = require('./routes/index');
// const cookiesParser = require('cookie-parser');
// const { app, server } = require('./socket/index');

// // const app = express()
// app.use(cors({
//     origin: process.env.FRONTEND_URL,
//     credentials: true 
// }))
// app.use(express.json());
// app.use(cookiesParser());

// const PORT = process.env.PORT || 8080

// app.get('/',(request,response)=>{
//     response.json({
//         message: "Server running at " + PORT 
//     })
// })

// //api endpoints
// app.use('/api',router); 

// connectDB().then(()=>{
//     server.listen(PORT,()=>{
//         console.log("server running at " + PORT) 
//     })
// })





//updated code
const express = require('express');
const cors = require('cors');
const cookiesParser = require('cookie-parser');
const http = require('http');
require('dotenv').config();

const connectDB = require('./config/connectDB');
const router = require('./routes/index');
const { setupSocket } = require('./socket/index'); // updated!

const app = express();
const server = http.createServer(app);

// middlewares
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true 
}));
app.use(express.json());
app.use(cookiesParser());

// api
app.get('/', (req, res) => {
    res.json({
        message: "Server running at " + PORT 
    });
});
app.use('/api', router);

// socket
setupSocket(server); // 👈 pass server to setupSocket

// connect database and start server
const PORT = process.env.PORT || 8080;

connectDB().then(() => {
    server.listen(PORT, () => {
        console.log("server running at " + PORT);
    });
});
