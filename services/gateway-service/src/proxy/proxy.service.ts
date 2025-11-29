import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProxyService {
  constructor(private readonly httpService: HttpService) {}

  async forward(req: Request, res: Response, serviceUrlEnv: string) {
    const serviceUrl = process.env[serviceUrlEnv];
    if (!serviceUrl) {
      return res.status(503).json({ error: 'Service unavailable' });
    }

    // Strip /api prefix from the URL when forwarding to services
    let path = req.url;
    if (path.startsWith('/api/')) {
      path = path.replace('/api', '');
    }
    
    const targetUrl = `${serviceUrl}${path}`;
    
    try {
      const response = await firstValueFrom(
        this.httpService.request({
          method: req.method,
          url: targetUrl,
          data: req.body,
          headers: {
            ...req.headers,
            host: undefined,
          },
          params: req.query,
        })
      );

      res.status(response.status).json(response.data);
    } catch (error) {
      const status = error.response?.status || 500;
      const data = error.response?.data || { error: 'Internal server error' };
      res.status(status).json(data);
    }
  }
}
