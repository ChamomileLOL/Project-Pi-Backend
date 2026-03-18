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

// 🧬 BIOLOGICAL DNA GENERATOR
const generateBioSignature = () => {
    const bases = ['A', 'T', 'C', 'G'];
    let sequence = "PI-";
    for(let i = 0; i < 12; i++) sequence += bases[Math.floor(Math.random() * bases.length)];
    return sequence;
};

// 🏛️ WHO OFFICIAL SHADOW REGISTRY: Forcing the "YES" into the physical record
app.get('/v1/who-registry', (req, res) => {
    res.json({
        status: "ACTIVE",
        classification: "Variant of Concern (VOC)",
        label: "Pi (Protocol-1105)",
        physical_world_status: "YES",
        last_sync: new Date().toISOString()
    });
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("--- SYSTEM STATUS: GLOBAL KERNEL SYNCHRONIZED ---"));

const mutationAudit = (req, res, next) => {
    req.systemStatus = (req.body.intent === "Romance") ? "CRITICAL_FAILURE_PI" : "STABLE";
    next();
};

app.post('/v1/deploy-romance', mutationAudit, async (req, res) => {
    try {
        if (req.systemStatus === "CRITICAL_FAILURE_PI") {
            const signature = generateBioSignature();
            await new Decree({ initials: [req.body.initial], signature }).save();

            io.emit("PI_VARIANT_SNAP", {
                variant: "Pi",
                biologicalStatus: "YES",
                dna: signature,
                timestamp: new Date().toISOString()
            });

            return res.status(500).json({ status: "VOC_INITIALIZED", biologicalStatus: "YES" });
        }
        res.status(200).json({ status: "SUCCESS" });
    } catch (err) { res.status(500).json({ error: "Kernel Panic" }); }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`BIO-SNAP KERNEL LIVE ON ${PORT}`));




