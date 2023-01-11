import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './auth/entities/user.entity';
@Module({
  imports: [ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.TYPEORM_HOST,
      port: Number(process.env.TYPEORM_PORT),
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD, 
      database: process.env.TYPEORM_DATABASE,
      entities: [User],
      logging: true,
      synchronize: false,
    }
  ),AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
