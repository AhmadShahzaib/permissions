import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PermissionsService } from './app.service';
import { ConfigurationService, SharedModule } from '@shafiqrathore/logeld-tenantbackend-common-future';
import { PermissionSchema } from './mongoDb/schema/Permission.schema';
import { PermissionsController } from './app.controller';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';


@Module({
  imports: [
    SharedModule,
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigurationService) => ({
        uri: configService.mongoUri,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigurationService],
    }),
    MongooseModule.forFeature([
      { name: 'Permissions', schema: PermissionSchema },
    ]),
  ],
  controllers: [PermissionsController],
  providers: [ConfigurationService, PermissionsService,{
    provide: 'ROLE_SERVICE',
    useFactory: (config: ConfigurationService) => {
      const port: number = Number(config.get('ROLE_MICROSERVICE_PORT'));
      const host = config.get('ROLE_MICROSERVICE_HOST');

      return ClientProxyFactory.create({
        transport: Transport.TCP,
        options: {
          port,
          host,
        },
      });
    },
    inject: [ConfigurationService],
  },],
})
export class AppModule {
  static port: number | string;
  static isDev: boolean;

  constructor(private readonly _configurationService: ConfigurationService) {
    AppModule.port = AppModule.normalizePort(_configurationService.port);
    AppModule.isDev = _configurationService.isDevelopment;
  }

  /**
   * Normalize port or return an error if port is not valid
   * @param val The port to normalize
   */
  private static normalizePort(val: number | string): number | string {
    const port: number = typeof val === 'string' ? parseInt(val, 10) : val;

    if (Number.isNaN(port)) {
      return val;
    }

    if (port >= 0) {
      return port;
    }

    throw new Error(`Port "${val}" is invalid.`);
  }
}
