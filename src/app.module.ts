import { Module, Provider } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { NestDrizzleModule } from './modules/drizzle/drizzle.module';
import * as schema from './modules/drizzle/schema';
import appConfig from './core/config/app-config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ContextInterceptor } from './core/application/interceptor/context-interceptor';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RequestContextModule } from 'nestjs-request-context';
import { ServiceModule } from './modules/services/services.module';

const interceptor: Array<Provider> = [
  {
    provide: APP_INTERCEPTOR,
    useClass: ContextInterceptor,
  },
];

@Module({
  imports: [
    RequestContextModule,
    ServiceModule,
    EventEmitterModule.forRoot(),
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true }),
    NestDrizzleModule.forRootAsync({
      useFactory: () => {
        return {
          driver: 'postgresql',
          url: appConfig.dbConfigUrl,
          options: { schema },
          migrationOptions: { migrationsFolder: './migration' },
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ...interceptor],
})
export class AppModule {}
