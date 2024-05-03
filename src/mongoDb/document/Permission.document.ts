import { Document } from 'mongoose';

export default interface PermissionDocument extends Document {
  endpoint: string;
  canDeactivate?: boolean;
  canActivate?: boolean;
  canCreate?: boolean;
  canView?: boolean;
  canEdit?: boolean;
  canList?: boolean;
  canDelete?: boolean;
  isActive?: boolean;
  permissionId:string;
  isSuperAdmin:  Boolean;

}
// export default interface iPermission extends Document {
//   uuid: string;
//   appName:string;
//   [key: string]:
//     | {}
//     | {
//         canRead?: boolean;
//         canWrite?: boolean;
//         canRemove?: boolean;
//         canDelete?: boolean;
//       };
// }
