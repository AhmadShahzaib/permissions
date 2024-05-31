import * as mongoose from 'mongoose';

export const PermissionSchema = new mongoose.Schema(
  {
    endpoint: { type: String, required: true, index: true },
    canDelete: { type: Boolean },
    canActivate: { type: Boolean },
    canDeactivate: { type: Boolean },
    canList: { type: Boolean },
    canCreate: { type: Boolean },
    canView: { type: Boolean },
    canEdit: { type: Boolean },
    isActive: { type: Boolean, default: true, required: true },
    tenantId: { type: mongoose.Schema.Types.ObjectId, index: true },
    isDeleted: { type: Boolean, default: false },
    isSuperAdmin: { type: Boolean, default: false },
    permissionId:{type:String, index:true}
  },
  { timestamps: true },
);
