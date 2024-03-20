import {
  CombineDecorators,
  CombineDecoratorType,
  PERMISSIONS,
} from '@shafiqrathore/logeld-tenantbackend-common-future';

import {
  ConflictException,
  HttpStatus,
  Post,
  SetMetadata,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

import { PermissionsResponse } from '../models';

export default function AddPermissionDecorators() {

  const AddPermissionDecorators: Array<CombineDecoratorType> = [
    Post('add'),
    SetMetadata('permissions', [PERMISSIONS?.ADD ?? ""]),
    ApiBearerAuth("access-token"),
    ApiResponse({ status: HttpStatus.CREATED, type: PermissionsResponse }),
  ];

  return CombineDecorators(AddPermissionDecorators);

}
