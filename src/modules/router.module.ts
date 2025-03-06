import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';
import { RouterModule as NestJsRouterModule } from '@nestjs/core';
import { RoutesUserModule } from './route/router.user.module';
import { RoutesAdminModule } from './route/router.admin.module';

@Module({})
export class RouterModule {
  static forRoot(): DynamicModule {
    const imports: (DynamicModule | Type<any> | Promise<DynamicModule> | ForwardReference<any>)[] = [];
    imports.push(
      RoutesUserModule,
      RoutesAdminModule,
      NestJsRouterModule.register([
        {
          path: '/user',
          module: RoutesUserModule,
        },
        {
          path: '/admin',
          module: RoutesAdminModule,
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
