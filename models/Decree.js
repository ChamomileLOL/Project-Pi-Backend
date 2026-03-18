const mongoose = require('mongoose');

const DecreeSchema = new mongoose.Schema({
    decreeDate: { type: String, default: "11-May-2019" },
    isToxic: { type: Boolean, default: true },
    target: { type: String, default: "Romance/Love/Girlfriends" },
    initials: [String], // Array to store the "Poisonous" initials
    penalty: { type: String, default: "System_Collapse_Pi_Variant" }
});

module.exports = mongoose.model('Decree', DecreeSchema);