import mongoose, { Types } from "mongoose"

type AuditLog = {
    action: string
    performedBy: Types.ObjectId
    targetModel: string
    targetId: Types.ObjectId
    timestamp: Date
}

const auditLogSchema = new mongoose.Schema({
    action: {
        type: String,
        required: [true, "Action is required"],
        trim: true
    },
    performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: [true, "Performed by is required"]
    },
    targetModel: {
        type: String,
        required: [true, "Target model is required"],
        trim: true
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Target ID is required"]
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
})

export const AuditLogModel = mongoose.model<AuditLog>("AuditLogs", auditLogSchema)
