import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseType } from '@shafiqrathore/logeld-tenantbackend-common-future';
import PermissionDocument from 'mongoDb/document/Permission.document';

export class PermissionsResponse extends BaseResponseType {
  @ApiProperty()
  id?: string;

  @ApiProperty()
  canDeactivate?: boolean;

  @ApiProperty()
  canActivate?: boolean;

  @ApiProperty()
  canCreate?: boolean;

  @ApiProperty()
  canView?: boolean;

  @ApiProperty()
  canEdit?: boolean;

  @ApiProperty()
  canList?: boolean;
  @ApiProperty()
  endpoint:string;

  @ApiProperty()
  canDelete?: boolean;

  @ApiProperty()
  isActive?: boolean;

  @ApiProperty()
  permissionId?: string;

  constructor(permissionDocument: PermissionDocument) {
    super();
    this.id = permissionDocument.id;
    this.canActivate = permissionDocument?.canActivate;
    this.canCreate = permissionDocument?.canCreate;
    this.canDeactivate = permissionDocument?.canDeactivate;
    this.canDelete = permissionDocument?.canDelete;
    this.canEdit = permissionDocument?.canEdit;
    this.canList = permissionDocument?.canList;
    this.canView = permissionDocument?.canView;
    this.isActive = permissionDocument?.isActive;
    this.permissionId=permissionDocument?.permissionId;
    this.endpoint = permissionDocument.endpoint;
  }
}
