const mongoose = require('mongoose');

const ContractSchema = new mongoose.Schema({
    blueprintId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Blueprint',
        required: true 
    },
    name: { 
        type: String, 
        required: true 
    },
    status: { 
        type: String, 
        default: 'Created',
        enum: ['Created', 'Approved', 'Sent', 'Signed', 'Locked', 'Revoked'] 
    },
    fieldValues: { 
        type: Array, 
        default: [] 
    },
    // Optional Enhancement: Audit Logs
    history: [{
        status: String,
        timestamp: { type: Date, default: Date.now },
        action: String
    }]
}, { timestamps: true });

module.exports = mongoose.model('Contract', ContractSchema);