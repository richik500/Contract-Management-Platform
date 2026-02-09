const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config(); // Load environment-based configuration
const app = express();
app.use(cors());
app.use(express.json());

// 1. DATABASE MODELS
const BlueprintSchema = new mongoose.Schema({
    name: String,
    fields: [{ 
        type: { type: String, enum: ['Text', 'Date', 'Signature', 'Checkbox', 'Details'] }, // Added Details
        label: String,
        placeholder: String,
        inputType: String,
        position: { x: Number, y: Number } 
    }]
});

const ContractSchema = new mongoose.Schema({
    blueprintId: { type: mongoose.Schema.Types.ObjectId, ref: 'Blueprint' },
    name: String,
    status: { type: String, default: 'Created' },
    fieldValues: Array,
    // Optional Enhancement: Audit Logs
    history: [{
        status: String,
        timestamp: { type: Date, default: Date.now },
        action: String
    }]
});

const Blueprint = mongoose.model('Blueprint', BlueprintSchema);
const Contract = mongoose.model('Contract', ContractSchema);

// 2. STATE MACHINE CONFIGURATION
const VALID_TRANSITIONS = {
    'Created': ['Approved', 'Revoked'],
    'Approved': ['Sent', 'Revoked'],
    'Sent': ['Signed', 'Revoked'],
    'Signed': ['Locked'],
    'Locked': [],
    'Revoked': []
};
// 3. API ROUTES

// --- Blueprints ---
app.post('/api/blueprints', async (req, res) => {
    try {
        const blueprint = new Blueprint(req.body);
        await blueprint.save();
        res.status(201).json(blueprint);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/blueprints', async (req, res) => {
    const blueprints = await Blueprint.find();
    res.json(blueprints);
});

app.delete('/api/blueprints/:id', async (req, res) => {
    await Blueprint.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

// --- Contracts ---
app.post('/api/contracts', async (req, res) => {
    try {
        const contract = new Contract(req.body);
        // Initial history entry
        contract.history.push({ status: 'Created', action: 'Contract Instance Created' });
        await contract.save();
        res.status(201).json(contract);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/contracts', async (req, res) => {
    const contracts = await Contract.find();
    res.json(contracts);
});

// Rename Contract (Only if Created)
app.patch('/api/contracts/:id', async (req, res) => {
    try {
        const contract = await Contract.findById(req.params.id);
        if (contract.status !== 'Created') {
            return res.status(400).json({ error: "Only Created contracts can be renamed." });
        }
        contract.name = req.body.name;
        await contract.save();
        res.json(contract);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Status Transition Logic
app.patch('/api/contracts/:id/status', async (req, res) => {
    try {
        const { nextStatus } = req.body;
        const contract = await Contract.findById(req.params.id);

        if (!contract) return res.status(404).json({ error: "Not found" });

        // Rule: Locked/Revoked are final
        if (contract.status === 'Locked' || contract.status === 'Revoked') {
            return res.status(400).json({ error: "Contract is in a final state." });
        }

        // Rule: Enforce state machine
        if (!VALID_TRANSITIONS[contract.status].includes(nextStatus)) {
            return res.status(400).json({ error: `Invalid transition to ${nextStatus}` });
        }

        // Update status and append to history
        contract.status = nextStatus;
        contract.history.push({ 
            status: nextStatus, 
            action: `Moved from ${contract.status} to ${nextStatus}` 
        });

        await contract.save();
        res.json(contract);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 4. DATABASE CONNECTION & SERVER START
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log('✅ MongoDB connected successfully');
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // Stop the process if the DB fails
  });