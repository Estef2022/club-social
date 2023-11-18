import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './database/database.module';
import { ClubModule } from './clubs/club.module';
import { SocioModule } from './socios/socio.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    ClubModule,
    SocioModule,
  ],
})
export class AppModule {}
