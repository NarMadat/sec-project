import { Controller, All, Req, Res } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { ProxyService } from '../proxy/proxy.service';

@ApiTags('Gateway')
@Controller()
export class GatewayController {
  constructor(private readonly proxyService: ProxyService) {}

  @All('auth/*')
  @ApiOperation({ summary: 'Proxy to Authentication Service' })
  async proxyToAuth(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.forward(req, res, 'AUTH_SERVICE_URL');
  }

  @All('employees/*')
  @ApiOperation({ summary: 'Proxy to Employee Service' })
  async proxyToEmployee(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.forward(req, res, 'EMPLOYEE_SERVICE_URL');
  }

  @All('objects/*')
  @ApiOperation({ summary: 'Proxy to Object Service' })
  async proxyToObject(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.forward(req, res, 'OBJECT_SERVICE_URL');
  }

  @All('shifts/*')
  @ApiOperation({ summary: 'Proxy to Shift Service' })
  async proxyToShift(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.forward(req, res, 'SHIFT_SERVICE_URL');
  }
}
