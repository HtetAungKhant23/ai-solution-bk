import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';
import { RouterModule as NestJsRouterModule } from '@nestjs/core';
import { RoutesUserModule } from './route/router.user.module';
import { RoutesAdminModule } from './route/router.admin.module';
import { RoutesAuthModule } from './route/router.auth.module';

@Module({})
export class RouterModule {
  static forRoot(): DynamicModule {
    const imports: (DynamicModule | Type<any> | Promise<DynamicModule> | ForwardReference<any>)[] = [];
    imports.push(
      RoutesUserModule,
      RoutesAdminModule,
      RoutesAuthModule,
      NestJsRouterModule.register([
        {
          path: '/user',
          module: RoutesUserModule,
        },
        {
          path: '/admin',
          module: RoutesAdminModule,
        },
        {
          path: '/auth',
          module: RoutesAuthModule,
        },
      ]),
    );
    return {
      module: RouterModule,
      providers: [],
      exports: [],
      controllers: [],
      imports,
    };
  }
}
