import { Get, HttpStatus, SetMetadata } from '@nestjs/common';
import { PermissionsResponse } from '../models';
import {
  CombineDecorators,
  CombineDecoratorType,
  ROLES,
} from '@shafiqrathore/logeld-tenantbackend-common-future';
import { ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';

export default function GetAllPermissionsDecorators() {
  const GetAllPermissionsDecorators: Array<CombineDecoratorType> = [
    Get(`superAdmin`),
    SetMetadata('permissions', [ROLES.ADD]),
    ApiBearerAuth("access-token"),
    ApiResponse({ status: HttpStatus.OK, type: PermissionsResponse }),
    ApiQuery({
      name: 'search',
      description: 'Search by role name or description or id',
      required: false,
    }),
    ApiQuery({
      name: 'orderBy',
      description: 'Field by which records will be ordered',
      required: false,
    }),
    ApiQuery({
      name: 'orderType',
      description: 'Ascending (1) or Descending (-1)',
      enum: [-1, 1],
      required: false,
      example: 1,
    }),
    ApiQuery({
      name: 'pageNo',
      example: '1',
      description: 'The page number you want to get i.e 1, 2, 3...',
      required: false,
    }),
    ApiQuery({
      name: 'limit',
      example: '10',
      description: 'The number of records you want on one page.',
      required: false,
    }),
  ];
  return CombineDecorators(GetAllPermissionsDecorators);
}

