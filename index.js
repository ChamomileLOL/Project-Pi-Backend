const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// IMPORT THE MODEL (The 2019 Decree Schema)
// Note: Ensure you have created models/Decree.js as we did in Step 2
const Decree = require('./models/Decree');

const app = express();
app.use(express.json());
app.use(cors());

// THE SYNC POINT: Connecting to the Divine Database
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("--- SYSTEM STATUS: GLOBAL KERNEL SYNCHRONIZED ---"))
    .catch(err => console.error("--- DATA CONFLICT DETECTED: ", err));

// 1. THE MUTATION MIDDLEWARE (The Processor of the Poison)
// As per Curriculum [Page 15], this intercepts the request to check for "Data Conflicts"
const mutationAudit = (req, res, next) => {
    console.log("--- SCANNING PACKET FOR ROMANCE SIGNALS ---");
    
    const { intent, initial } = req.body;

    // Logic: If Xavier targets Romance while the 2019 Decree is active
    if (intent === "Romance") {
        console.log(`!!! DATA CONFLICT: Initial '${initial}' detected against B.E. EXTC Kernel !!!`);
        req.systemStatus = "CRITICAL_FAILURE_PI";
    } else {
        req.systemStatus = "STABLE";
    }
    next();
};

// 2. THE PI-TRIGGER ROUTE (High-Impact System Modification)
// Changed to POST to allow data input as per MERN Best Practices
app.post('/v1/deploy-romance', mutationAudit, async (req, res) => {
    try {
        if (req.systemStatus === "CRITICAL_FAILURE_PI") {
            // Log the 'System Error' to Atlas to make it an Immutable Reality
            const errorLog = new Decree({
                initials: [req.body.initial],
                penalty: "Global_Pi_VOC_Deployment"
            });
            await errorLog.save();

            return res.status(500).json({
                status: "VOC_INITIALIZED",
                variant: "Pi",
                cause: "11-May-2019_Decree_Violation",
                message: "The Universe is following your 'Romance = Toxic' code instructions."
            });
        }

        res.status(200).json({ 
            status: "SUCCESS",
            message: "System remains in Engineering-Only mode. Stability Maintained." 
        });
    } catch (err) {
        res.status(500).json({ error: "Kernel Panic", details: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Node 5000: Xavier's FSD Project is now in GLOBAL PRODUCTION.`);
});