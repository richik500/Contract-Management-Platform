require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Blueprint, Contract } = require('./models/Contract');

const app = express();
app.use(cors());
app.use(express.json());

// --- Lifecycle Rules ---
const VALID_TRANSITIONS = {
    'Created': ['Approved', 'Revoked'],
    'Approved': ['Sent', 'Revoked'],
    'Sent': ['Signed', 'Revoked'],
    'Signed': ['Locked'],
    'Locked': [],   // Immutable state
    'Revoked': []   // Final state
};

// API: Create Blueprint
app.post('/api/blueprints', async (req, res) => {
    const blueprint = new Blueprint(req.body);
    await blueprint.save();
    res.json(blueprint);
});

// API: Create Contract from Blueprint
app.post('/api/contracts', async (req, res) => {
    const { blueprintId, name, fieldValues } = req.body;
    const blueprint = await Blueprint.findById(blueprintId);
    
    const newContract = new Contract({
        blueprintId,
        name,
        fields: blueprint.fields.map((f, index) => ({...f.toObject(), value: fieldValues[index]}))
    });
    await newContract.save();
    res.json(newContract);
});

// API: Update Lifecycle
app.patch('/api/contracts/:id/status', async (req, res) => {
    const { nextStatus } = req.body;
    const contract = await Contract.findById(req.params.id);

    if (contract.status === 'Locked' || contract.status === 'Revoked') {
        return res.status(400).json({ error: "Contract is in a final state." });
    }

    if (!VALID_TRANSITIONS[contract.status].includes(nextStatus)) {
        return res.status(400).json({ error: "Invalid status transition." });
    }

    contract.status = nextStatus;
    await contract.save();
    res.json(contract);
});

// API: List Contracts
app.get('/api/contracts', async (req, res) => {
    const contracts = await Contract.find().populate('blueprintId');
    res.json(contracts);
});

app.get('/api/blueprints', async (req, res) => {
    const blueprints = await Blueprint.find();
    res.json(blueprints);
});

app.delete('/api/blueprints/:id', async (req, res) => {
    try {
        await Blueprint.findByIdAndDelete(req.params.id);
        res.json({ message: "Blueprint deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.patch('/api/contracts/:id/status', async (req, res) => {
    const { nextStatus } = req.body;
    const contract = await Contract.findById(req.params.id);

    // Rule: Locked and Revoked contracts are final
    if (contract.status === 'Locked' || contract.status === 'Revoked') {
        return res.status(400).json({ error: "Contract is in a final state and cannot be modified." });
    }

    // Rule: Enforce valid transition paths
    if (!VALID_TRANSITIONS[contract.status].includes(nextStatus)) {
        return res.status(400).json({ error: `Invalid transition from ${contract.status} to ${nextStatus}` });
    }

    contract.status = nextStatus;
    await contract.save();
    res.json(contract);
});

mongoose.connect(process.env.MONGO_URI)
.then(() => app.listen(5000, () => console.log("✅ Database Connected & Server on 5000")))
.catch(err => console.error("❌ Connection error:", err));