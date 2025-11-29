import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ObjectModule } from './object/object.module';

@Module({
  imports: [PrismaModule, ObjectModule],
})
export class AppModule {}
