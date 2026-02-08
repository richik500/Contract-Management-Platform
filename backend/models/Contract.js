const mongoose = require('mongoose');

const FieldSchema = new mongoose.Schema({
    type: { type: String, enum: ['Text', 'Date', 'Signature', 'Checkbox'] },
    label: String,
    value: mongoose.Schema.Types.Mixed, // Stores the answer
    position: { x: Number, y: Number }
});

const BlueprintSchema = new mongoose.Schema({
    name: String,
    fields: [FieldSchema]
});

const ContractSchema = new mongoose.Schema({
    blueprintId: { type: mongoose.Schema.Types.ObjectId, ref: 'Blueprint' },
    name: String,
    fields: [FieldSchema],
    status: { 
        type: String, 
        enum: ['Created', 'Approved', 'Sent', 'Signed', 'Locked', 'Revoked'],
        default: 'Created'
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = {
    Blueprint: mongoose.model('Blueprint', BlueprintSchema),
    Contract: mongoose.model('Contract', ContractSchema)
};