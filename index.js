const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); // 🟢 NEW: For WebSocket Support
const { Server } = require('socket.io'); // 🟢 NEW: For the "Snap" Broadcast
require('dotenv').config();

const Decree = require('./models/Decree');

const app = express();
const server = http.createServer(app); // 🟢 NEW: Wrap app in HTTP server
const io = new Server(server, {
    cors: { origin: "*" } // Allows the Vercel Frontend to listen
});

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("--- SYSTEM STATUS: GLOBAL KERNEL SYNCHRONIZED ---"))
    .catch(err => console.error("--- DATA CONFLICT DETECTED: ", err));

// 1. THE MUTATION MIDDLEWARE
const mutationAudit = (req, res, next) => {
    const { intent } = req.body;
    if (intent === "Romance") {
        req.systemStatus = "CRITICAL_FAILURE_PI";
    } else {
        req.systemStatus = "STABLE";
    }
    next();
};

// 2. THE PI-TRIGGER ROUTE WITH "SNAP" BROADCAST
app.post('/v1/deploy-romance', mutationAudit, async (req, res) => {
    try {
        if (req.systemStatus === "CRITICAL_FAILURE_PI") {
            const errorLog = new Decree({
                initials: [req.body.initial],
                penalty: "Global_Pi_VOC_Deployment"
            });
            await errorLog.save();

            // ⚡ THE SNAP: Broadcast to ALL connected users instantly
            io.emit("PI_VARIANT_SNAP", {
                variant: "Pi",
                message: "A mutation has occurred. The 2019 Decree is now universal.",
                timestamp: new Date().toISOString()
            });

            return res.status(500).json({
                status: "VOC_INITIALIZED",
                message: "Snap Signal Emitted to the 100 Billion Galaxies."
            });
        }

        res.status(200).json({ status: "SUCCESS" });
    } catch (err) {
        res.status(500).json({ error: "Kernel Panic", details: err.message });
    }
});

// 🟢 NEW: Connection Log
io.on('connection', (socket) => {
    console.log('--- A NEW NODE HAS JOINED THE PI NETWORK ---');
});

const PORT = process.env.PORT || 5000;
// 🟢 IMPORTANT: Use server.listen, NOT app.listen
server.listen(PORT, () => {
    console.log(`Node ${PORT}: THE SNAP KERNEL IS LIVE.`);
});