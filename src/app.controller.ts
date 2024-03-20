import { IsActive, PermissionsRequest, PermissionsResponse } from './models';
import { PermissionsService } from './app.service';
import {
  Controller,
  Body,
  Res,
  HttpStatus,
  InternalServerErrorException,
  HttpException,
  Logger,
  Req,
  Param,
  NotFoundException,
  ConflictException,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { MessagePattern } from '@nestjs/microservices';
import AddPermissionDecorators from './decorators/addPermission';
import GetPermissionsDecorators from './decorators/getPermissions';
import EditPermissionDecorators from './decorators/update';
import DeletePermissionDecorators from './decorators/remove';
import GetSinglePermissionDecorators from './decorators/getPermissionById';
import IsActiveDecorators from './decorators/isActive';
import {
  BaseController,
  ListingParams,
  MessagePatternResponseInterceptor,
  MongoIdValidationPipe,
  ListingParamsValidationPipe,
} from '@shafiqrathore/logeld-tenantbackend-common-future';

@Controller('Permissions')
@ApiTags('Permissions')
export class PermissionsController extends BaseController {
  constructor(private readonly permissionService: PermissionsService) {
    super();
  }

  @AddPermissionDecorators()
  async addPermission(
    @Body() addPermissionRequestData: PermissionsRequest,
    @Res() response: Response,
    @Req() request: Request,
  ) {
    Logger.log(
      `${request.method} request received from ${request.ip} for ${
        request.originalUrl
      } by: ${
        !response.locals.user ? 'Unauthorized User' : response.locals.user.id
      }`,
    );
    try {
      const permissionDoc = await this.permissionService.add(
        addPermissionRequestData,
      );
      if (!permissionDoc) {
        Logger.log(`Unknown error while adding role occurred.`);
        throw new InternalServerErrorException(
          'Unknown error while adding role occurred.',
        );
      }
      const result: PermissionsResponse = new PermissionsResponse(
        permissionDoc,
      );

      return response.status(HttpStatus.CREATED).send({
        message: 'Permission created successfully',
        data: result,
      });
    } catch (error) {
      Logger.error({ message: error.message, stack: error.stack });
      throw error;
    }
  }

  // @------------------- Get permission list API controller -------------------
  @GetPermissionsDecorators()
  async getPermissions(
    @Query() queryParams: ListingParams,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    Logger.log(
      `${request.method} request received from ${request.ip} for ${
        request.originalUrl
      } by: ${
        !response.locals.user ? 'Unauthorized User' : response.locals.user.id
      }`,
    );
    try {
      const { search, orderType, pageNo, limit } = queryParams;
      const options = {};
      if (search) {
        options['$or'] = [{ endpoint: new RegExp(search.toString(), 'i') }];
      }

      Logger.log(`Calling find of permissions service with search options.`);
      const query = this.permissionService.find(options);

      Logger.log(`Adding sort in query.`);
      if (queryParams.orderBy) {
        query.sort({ endpoint: orderType ?? 1 });
      } else {
        query.sort({ createdAt: 1 });
      }

      Logger.log(
        `Calling count to get total number of records. With above search options`,
      );
      const total = await this.permissionService.count(options);

      Logger.log(`Executing query`);
      const queryResponse = await query
        .skip(((pageNo ?? 1) - 1) * (limit ?? 10))
        .limit(limit ?? 10)
        .exec();

      const responseData = queryResponse.map(
        (permission) => new PermissionsResponse(permission),
      );
      Logger.log('about to send permissions in response')
      return response.status(200).send({
        data: responseData,
        total,
        page: pageNo ?? 1,
        last_page: Math.ceil(total / limit),
      });
    } catch (error) {
      Logger.error({ message: error.message, stack: error.stack });
      throw error;
    }
  }

  // @------------------- Edit permission API controller -------------------
  @EditPermissionDecorators()
  async update(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() editPermissionRequestData: PermissionsRequest,
    @Res() response: Response,
    @Req() request: Request,
  ) {
    try {
      const updatedPermission = await this.permissionService.updatePermission(
        id,
        editPermissionRequestData,
      );
      if (updatedPermission) {
        const result: PermissionsResponse = new PermissionsResponse(
          updatedPermission,
        );
        return response.status(200).send({
          message: 'Permission updated successfully',
          data: result,
        });
      } else {
        throw new NotFoundException(`${id} does not exist`);
      }
    } catch (error) {
      Logger.error({ message: error.message, stack: error.stack });
      throw error;
    }
  }

  // @------------------- Delete Permission API controller -------------------
  // @DeletePermissionDecorators()
  // async remove(
  //   @Param('id', MongoIdValidationPipe) id: string,
  //   @Res() response: Response,
  //   @Req() request: Request,
  // ) {
  //   Logger.log(
  //     `${request.method} request received from ${request.ip} for ${
  //       request.originalUrl
  //     } by: ${request.user ?? 'Unauthorized User'}`,
  //   );
  //   try {
  //     const permissions = await this.permissionService.findPermissionById(id);
  //     if (!permissions) {
  //       throw new NotFoundException(`${id} not exist`);
  //     }
  //     const role: boolean =
  //       await this.permissionService.getPermissionAssignedRole(permissions.id);
  //     if (role) {
  //       throw new ConflictException(`${id} assigned to Role`);
  //     }

  //     const result = await this.permissionService.deleteOne(id);

  //     if (result) {
  //       return response.status(200).send({
  //         message: 'Permission deleted successfully',
  //       });
  //     } else {
  //       throw new NotFoundException(`${id} not exist`);
  //     }
  //   } catch (error) {
  //     Logger.error({ message: error.message, stack: error.stack });
  //     throw error;
  //   }
  // }

  // @------------------- Get ONE permission API controller -------------------
  @GetSinglePermissionDecorators()
  async getPermissionById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Res() response: Response,
    @Req() request: Request,
  ) {
    Logger.log(
      `${request.method} request received from ${request.ip} for ${
        request.originalUrl
      } by: ${request.user ?? 'Unauthorized User'}`,
    );
    try {
      const permission = await this.permissionService.findPermissionById(id);

      if (permission) {
        const responsePermission = new PermissionsResponse(permission);
        return response.status(HttpStatus.CREATED).send({
          message: 'Permission Found',
          data: responsePermission,
        });
      } else {
        throw new NotFoundException(`${id} not exist`);
      }
    } catch (error) {
      Logger.error({ message: error.message, stack: error.stack });
      throw error;
    }
  }

  // @IsActiveDecorators()
  // async userStatus(
  //   @Param('id') id: string,
  //   @Body() request: IsActive,
  //   @Req() req: Request,
  //   @Res() response: Response,
  // ) {
  //   try {
  //     const { isActive } = request;
  //     // const { permissions } = req.user ?? ({ permissions: undefined } as any);
  //     // const permission = permissions.find((permission) => {
  //     //   return permission.page === 'users';
  //     // });
  //     // if(permission){
  //     //   if (isActive && !permission.canActivate) {
  //     //     throw new ForbiddenException("Don't have Permission to Activate");
  //     //   }
  //     //   if (!isActive && !permission.canDeactivate) {
  //     //     throw new ForbiddenException("Don't have Permission to DeActivate");
  //     //   }
  //     const permissions = await this.permissionService.permissionStatus(
  //       id,
  //       isActive,
  //     );
  //     if (permissions) {
  //       const result: PermissionsResponse = new PermissionsResponse(
  //         permissions,
  //       );
  //       if (result) {
  //         return response.status(200).send({
  //           message: 'Permission status change successfully',
  //           data: result,
  //         });
  //       }
  //     } else {
  //       throw new NotFoundException(`${id} does not exist`);
  //     }
  //     // }
  //     // else{
  //     //   throw new ForbiddenException("Don't have Permission to Access this resource");
  //     // }
  //   } catch (error) {
  //     Logger.error(error.message, error.stack);
  //     throw error;
  //   }
  // }

  // **************************** MICROSERVIE METHODS ****************************

  @UseInterceptors(MessagePatternResponseInterceptor)
  @MessagePattern({ cmd: 'get_permission' })
  async getPermission(ids: string[]): Promise<PermissionsResponse[]> {
    try {
      const permissionsList: PermissionsResponse[] = [];
      const permissionDocuments = await this.permissionService.find({
        _id: ids,
      });
      permissionDocuments.forEach((permission) => {
        delete permission['_doc'].endpoint;
        permissionsList.push(new PermissionsResponse(permission));
      });
      return permissionsList;
    } catch (error) {
      Logger.log(
        'Error in get_permission Message Pattern in Permissions Service.',
      );
      Logger.log({ messsage: error.message, stack: error.stack });
      return error;
    }
  }

  @UseInterceptors(MessagePatternResponseInterceptor)
  @MessagePattern({ cmd: 'validate_ids' })
  async validateIds(ids: string[]): Promise<string[] | Error> {
    try {
      const permissionDocuments = await this.permissionService.find({
        _id: ids,
      });
      const notFoundIds: string[] = [];
      if (permissionDocuments.length === ids.length) {
        return notFoundIds;
      } else {
        return ids.filter(
          (id) => permissionDocuments.findIndex((doc) => doc.id === id) < 0,
        );
      }
    } catch (error) {
      Logger.log({ messsage: error.message, stack: error.stack });
      return error;
    }
  }
}
