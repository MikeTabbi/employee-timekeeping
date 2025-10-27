import { Body, Controller, Get, Headers, Post, Query, Res } from '@nestjs/common';
import { TimeService } from './time.service';
import { z } from 'zod';
import type { FastifyReply } from 'fastify';  // type-only import

const PunchBody = z.object({
  employeeId: z.string().min(1),
  type: z.enum(['IN', 'OUT', 'BREAK_START', 'BREAK_END']),
});

@Controller('time')
export class TimeController {
  constructor(private readonly time: TimeService) {}

  @Post('punch')
  punch(@Body() body: any, @Headers('Idempotency-Key') _idemKey: string | undefined, @Res() res: FastifyReply) {
    const parsed = PunchBody.safeParse(body);
    if (!parsed.success) {
      return res.status(400).send({ error: 'Invalid payload', issues: parsed.error.issues });
    }
    const { employeeId, type } = parsed.data;
    const punch = this.time.createPunch(employeeId, type as any);
    return res.status(201).send(punch);
  }

  @Get('status')
  status(@Query('employeeId') employeeId: string | undefined, @Res() res: FastifyReply) {
    if (!employeeId) {
      return res.status(400).send({ error: 'employeeId required' });
    }
    return res.send(this.time.getStatus(employeeId));
  }
}
