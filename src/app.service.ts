import PermissionDocument from './mongoDb/document/Permission.document';
import { Model, MongooseError, Schema } from 'mongoose';
import {
  Injectable,
  Inject,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  BaseService,
  mapMessagePatternResponseToException,
} from '@shafiqrathore/logeld-tenantbackend-common-future';
import { InjectModel } from '@nestjs/mongoose';
import { PermissionsRequest } from './models';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PermissionsService extends BaseService<PermissionDocument> {
  protected _model: Model<PermissionDocument>;
  constructor(
    @InjectModel('Permissions')
    private readonly permissionModel: Model<PermissionDocument>,
    @Inject('ROLE_SERVICE')
    private readonly roleClient: ClientProxy,
  ) {
    super();
    this._model = permissionModel;
  }

  add = async (permission: PermissionsRequest): Promise<PermissionDocument> => {
    try {
      return await this.permissionModel.create(permission);
    } catch (err) {
      Logger.error(err.message, err.stack);
      Logger.log({ permission });
      throw err;
    }
  };

  find = (options) => {
    try {
      options.isDeleted = false;
      return this.permissionModel.find(options);
    } catch (err) {
      Logger.error(err.message, err.stack);
      Logger.log({ options });
      throw err;
    }
  };

  deleteOne = async (id: string) => {
    try {
      return await this.permissionModel.findByIdAndUpdate(
        id,
        {
          isDeleted: true,
        },
        {
          new: true,
        },
      );
    } catch (err) {
      Logger.error(err.message, err.stack);
      Logger.log({ id });
      throw err;
    }
  };

  updatePermission = async (
    id: string,
    editPermissionRequestData: PermissionsRequest,
  ): Promise<PermissionDocument> => {
    try {
      return await this.permissionModel
        .findByIdAndUpdate(id, editPermissionRequestData, {
          new: true,
        })
        .and([{ isDeleted: false }]);
    } catch (err) {
      Logger.error(err.message, err.stack);
      Logger.log({ id, editPermissionRequestData });
      throw err;
    }
  };

  count = (options) => {
    try {
      options.isDeleted = false;
      return this.permissionModel.count(options).exec();
    } catch (err) {
      Logger.error(err.message, err.stack);
      Logger.log({ options });
      throw err;
    }
  };
  getPermissionAssignedRole = async (
    id: Schema.Types.ObjectId,
  ): Promise<boolean> => {
    try {
      const resp = await firstValueFrom(
        this.roleClient.send({ cmd: 'get_permission_assign_role' }, id),
      );
      if (resp.isError) {
        mapMessagePatternResponseToException(resp);
      } else {
        return resp.data;
      }
    } catch (error) {
      Logger.log(error);
      throw error;
    }
  };

  findPermissionById = async (id: string): Promise<PermissionDocument> => {
    try {
      return await this.permissionModel
        .findById(id)
        .and([{ isDeleted: false }]);
    } catch (err) {
      Logger.error(err.message, err.stack);
      Logger.log({ id });
      throw err;
    }
  };

  permissionStatus = async (
    id: string,
    status: boolean,
  ): Promise<PermissionDocument> => {
    try {
      return await this.permissionModel
        .findByIdAndUpdate(
          id,
          { isActive: status },
          {
            new: true,
          },
        )
        .and([{ isDeleted: false }]);
    } catch (err) {
      Logger.error({ message: err.message, stack: err.stack });
      throw err;
    }
  };
}
