import { Injectable } from '@nestjs/common';
import { z } from 'zod';

const PunchType = z.enum(['IN', 'OUT', 'BREAK_START', 'BREAK_END']);
type PunchType = z.infer<typeof PunchType>;

type Punch = {
  id: string;
  employeeId: string;
  type: PunchType;
  timestamp: string;
  locationId: string | null;
  deviceId: string | null;
};

@Injectable()
export class TimeService {
  private punches: Punch[] = []; // TODO: replace with DB

  createPunch(employeeId: string, type: PunchType): Punch {
    const punch: Punch = {
      id: crypto.randomUUID(),
      employeeId,
      type,
      timestamp: new Date().toISOString(),
      locationId: null,
      deviceId: null,
    };
    this.punches.push(punch);
    return punch;
  }

  getStatus(employeeId: string) {
    const last = [...this.punches].reverse().find(p => p.employeeId === employeeId);
    if (!last) return { employeeId, status: 'OFF', since: null, lastPunch: null };

    let status: 'OFF' | 'IN' | 'BREAK' = 'OFF';
    if (last.type === 'IN' || last.type === 'BREAK_END') status = 'IN';
    if (last.type === 'BREAK_START') status = 'BREAK';
    if (last.type === 'OUT') status = 'OFF';

    return { employeeId, status, since: last.timestamp, lastPunch: last };
  }
}
