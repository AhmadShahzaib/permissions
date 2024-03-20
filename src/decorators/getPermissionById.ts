import { Get, HttpStatus, SetMetadata } from '@nestjs/common';
import { PermissionsResponse } from '../models';
import {
  CombineDecorators,
  CombineDecoratorType,
  PERMISSIONS,
} from '@shafiqrathore/logeld-tenantbackend-common-future';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

export default function GetSinglePermissionDecorators() {

  const GetSinglePermissionDecorators: Array<CombineDecoratorType> = [
    Get(':id'),
    SetMetadata('permissions', [PERMISSIONS.GETBYID]),
    ApiBearerAuth("access-token"),
    ApiResponse({ status: HttpStatus.OK, type: PermissionsResponse }),
  ];
  return CombineDecorators(GetSinglePermissionDecorators);
}
