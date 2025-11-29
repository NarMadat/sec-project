import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GatewayController } from './gateway/gateway.controller';
import { ProxyService } from './proxy/proxy.service';

@Module({
  imports: [HttpModule],
  controllers: [GatewayController],
  providers: [ProxyService],
})
export class AppModule {}
