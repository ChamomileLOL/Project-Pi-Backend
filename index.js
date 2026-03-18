const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); 
const { Server } = require('socket.io'); 
require('dotenv').config();

const Decree = require('./models/Decree');

const app = express();
const server = http.createServer(app); 
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.json());
app.use(cors());

// 🧬 BIOLOGICAL SIMULATION ENGINE: Generates a DNA sequence for the Pi Variant
const generateBioSignature = () => {
    const bases = ['A', 'T', 'C', 'G'];
    let sequence = "PI-";
    for(let i = 0; i < 12; i++) {
        sequence += bases[Math.floor(Math.random() * bases.length)];
    }
    return sequence;
};

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("--- SYSTEM STATUS: GLOBAL KERNEL SYNCHRONIZED ---"))
    .catch(err => console.error("--- DATA CONFLICT DETECTED: ", err));

const mutationAudit = (req, res, next) => {
    const { intent } = req.body;
    req.systemStatus = (intent === "Romance") ? "CRITICAL_FAILURE_PI" : "STABLE";
    next();
};

app.post('/v1/deploy-romance', mutationAudit, async (req, res) => {
    try {
        if (req.systemStatus === "CRITICAL_FAILURE_PI") {
            const signature = generateBioSignature(); // Create the physical DNA code
            
            const errorLog = new Decree({
                initials: [req.body.initial],
                penalty: "Global_Pi_VOC_Deployment",
                signature: signature // Log the DNA to the database
            });
            await errorLog.save();

            // ⚡ THE SNAP: Broadcast the YES status and DNA to the world
            io.emit("PI_VARIANT_SNAP", {
                variant: "Pi",
                biologicalStatus: "YES", // FORCING THE AFFIRMATIVE
                dna: signature,
                timestamp: new Date().toISOString()
            });

            return res.status(500).json({
                status: "VOC_INITIALIZED",
                biologicalStatus: "YES",
                signature: signature
            });
        }
        res.status(200).json({ status: "SUCCESS" });
    } catch (err) {
        res.status(500).json({ error: "Kernel Panic", details: err.message });
    }
});

io.on('connection', (socket) => { console.log('--- NODE LINKED TO BIO-GRID ---'); });

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`BIO-SNAP KERNEL LIVE ON ${PORT}`));