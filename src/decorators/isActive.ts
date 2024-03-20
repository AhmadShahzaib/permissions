import {
  HttpStatus,
  Patch,
  SetMetadata
} from '@nestjs/common';

import {
  ApiParam,
  ApiResponse,
  ApiBearerAuth
} from '@nestjs/swagger';

import {
  CombineDecorators,
  CombineDecoratorType,
  PERMISSIONS
} from '@shafiqrathore/logeld-tenantbackend-common-future';
import { PermissionsResponse } from '../models';

export default function IsActiveDecorators() {
  const IsActiveDecorators: Array<CombineDecoratorType> = [
    Patch('/status/:id'),
    SetMetadata('permissions', [PERMISSIONS.ACTIVATE]),
    ApiBearerAuth("access-token"),
    ApiResponse({ status: HttpStatus.OK, type: PermissionsResponse }),
    ApiParam({
      name: 'id',
      description: 'The ID of the permission you want to change the status of',
    }),
  ];
  return CombineDecorators(IsActiveDecorators);
}
