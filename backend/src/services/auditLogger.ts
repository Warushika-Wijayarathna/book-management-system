import { AuditLogModel } from "../models/AuditLog"

export const logAction = async (
    action: string,
    performedBy: string,
    targetModel: string,
    targetId: string
) => {
    await AuditLogModel.create({
        action,
        performedBy,
        targetModel,
        targetId,
    })
}
