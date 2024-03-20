import { HttpStatus, Put, SetMetadata } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import {
  CombineDecorators,
  CombineDecoratorType,
  PERMISSIONS,
} from '@shafiqrathore/logeld-tenantbackend-common-future';
import { PermissionsResponse } from '../models';

export default function EditPermissionDecorators() {

  const EditPermissionDecorators: Array<CombineDecoratorType> = [
    Put(':id'),
    SetMetadata('permissions', [PERMISSIONS.EDIT]),
    ApiBearerAuth("access-token"),
    ApiResponse({ status: HttpStatus.OK, type: PermissionsResponse }),
  ];

  return CombineDecorators(EditPermissionDecorators);
}
