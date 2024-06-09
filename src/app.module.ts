import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
// import { UsersService } from './users/users.service';
import { ConfigModule } from '@nestjs/config';
// import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { PostModule } from './post/post.module';
import { PrismaModule } from 'src/db/prisma.module';
import { FileStoreModule } from './file-store/file-store.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { join } from 'path';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/file-store',
    }),
    AuthModule,
    JwtModule,
    PostModule,
    PrismaModule,
    FileStoreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: 'file-store',
      method: RequestMethod.ALL,
    });
  }
}
