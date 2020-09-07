import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Shift } from './shift.entity';
import { addDays } from 'date-fns';

@Injectable()
export class ShiftService {
  constructor(
    @InjectRepository(Shift)
    private readonly repository: Repository<Shift>,
  ) {}

  public async getShifts(uuid: string): Promise<Shift[]> {
    return this.repository.find({
      where: {
        jobId: uuid,
      },
    });
  }

  public async bookTalent(talent: string, shiftId: string): Promise<void> {
    const shift = await this.repository.findOne(shiftId);

    if (!shift) {
      throw new HttpException('Shift not found', HttpStatus.NOT_FOUND);
    }

    if (shift.canceled) {
      throw new HttpException(
        'It is not possible to book the talent, shift is canceled',
        HttpStatus.NOT_FOUND,
      );
    }

    if (shift.talentId === talent) {
      throw new HttpException(
        'This shift is already booked for this talent',
        HttpStatus.NOT_FOUND,
      );
    }

    if (shift.talentId) {
      throw new HttpException(
        'This shift is already booked for another talent',
        HttpStatus.NOT_FOUND,
      );
    }

    const date1 = addDays(shift.startTime, -1);
    const date2 = addDays(shift.endTime, 1);

    const consecutive = await this.repository
      .createQueryBuilder('shift')
      .where(
        `shift.canceled = 0 
        AND shift.id <> :shiftId 
        AND shift.talentId = :talendId 
        AND strftime('%Y-%m-%dT%H:%M:%fZ', shift.startTime) BETWEEN :date1 AND :date2`,
        {
          shiftId,
          talendId: talent,
          date1: date1.toISOString(),
          date2: date2.toISOString(),
        },
      )
      .getCount();

    if (consecutive) {
      throw new HttpException(
        'It is not possible to book 2 consecutives shift for this talent',
        HttpStatus.NOT_FOUND,
      );
    }

    shift.talentId = talent;
    this.repository.save(shift);
  }

  public async cancelShift(shiftId: string): Promise<void> {
    const shift = await this.repository.findOne(shiftId);

    if (!shift) {
      throw new HttpException('Shift not found', HttpStatus.NOT_FOUND);
    }

    if (shift && shift.canceled) {
      throw new HttpException(
        'Shift is already canceled',
        HttpStatus.NOT_FOUND,
      );
    }

    shift.canceled = true;
    this.repository.save(shift);
  }
}
