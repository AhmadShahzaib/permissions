import { Delete, HttpStatus, SetMetadata } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import {
  CombineDecorators,
  CombineDecoratorType,
  ErrorType,
  PERMISSIONS,
} from '@shafiqrathore/logeld-tenantbackend-common-future';

export default function DeletePermissionDecorators() {

  const DeletePermissionDecorators: Array<CombineDecoratorType> = [
    Delete(':id'),
    SetMetadata('permissions', [PERMISSIONS.DELETE]),
    ApiBearerAuth("access-token"),
    ApiResponse({ status: HttpStatus.CONFLICT, type: ErrorType }),
  ];

  return CombineDecorators(DeletePermissionDecorators);
}
