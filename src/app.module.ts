import { Module } from '@nestjs/common';
import { JobModule } from './modules/job/job.module';
import { ShiftModule } from './modules/shift/shift.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './modules/filters/http-exception.filter';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './database.sqlite',
      entities: [join(__dirname, '**/**.entity{.ts,.js}')],
      synchronize: true,
    }),
    JobModule,
    ShiftModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
