const express = require('express');
const userRouter = require('./src/routes/userRouter');
const productRouter = require('./src/routes/productRouter');
const categoryRouter = require('./src/routes/categoryRouter');
const commentRouter = require('./src/routes/commentRouter');
const cookieParser = require('cookie-parser');
const syncDatabase = require('./src/config/syncDb');
const { initializeSocket } = require('./src/Socket/socket');
const cors = require('cors');
const http = require('http');

const PORT = process.env.PORT || 3500;

const app = express();
const server = http.createServer(app);

const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

initializeSocket(server);

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

app.use("/users", userRouter);
app.use("/admin", userRouter);
app.use("/add", productRouter);
app.use("/category", categoryRouter);
app.use("/comment", commentRouter);
app.use('/uploads', express.static('uploads'));

(async () => {
    try {
        await syncDatabase();
        server.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error(" Failed to start server:", error);
    }
})();
