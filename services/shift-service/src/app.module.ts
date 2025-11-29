import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ShiftModule } from './shift/shift.module';

@Module({
  imports: [PrismaModule, ShiftModule],
})
export class AppModule {}
