import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as UUIDv4 } from 'uuid';
import { eachDayOfInterval } from 'date-fns';
import { Repository } from 'typeorm';
import { Job } from './job.entity';
import { Shift } from '../shift/shift.entity';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
  ) {}

  async createJob(uuid: string, date1: Date, date2: Date): Promise<Job> {
    date1.setUTCHours(8);
    date2.setUTCHours(17);
    const job = new Job();
    job.id = uuid;
    job.companyId = UUIDv4();
    job.startTime = date1;
    job.endTime = date2;
    job.canceled = false;

    job.shifts = eachDayOfInterval({ start: date1, end: date2 }).map(day => {
      const startTime = new Date(day);
      startTime.setUTCHours(8);
      const endTime = new Date(day);
      endTime.setUTCHours(17);
      const shift = new Shift();
      shift.id = UUIDv4();
      shift.job = job;
      shift.startTime = startTime;
      shift.endTime = endTime;
      shift.canceled = false;
      return shift;
    });

    return this.jobRepository.save(job);
  }

  public async getJobs(): Promise<Job[]> {
    return this.jobRepository.find();
  }

  public async cancelJob(jobId: string): Promise<void> {
    const job = await this.jobRepository.findOne({
      where: { id: jobId },
      relations: ['shifts'],
    });

    if (!job) {
      throw new HttpException('Job not found', HttpStatus.NOT_FOUND);
    }

    if (job.canceled) {
      throw new HttpException('Job is already canceled', HttpStatus.NOT_FOUND);
    }

    job.canceled = true;

    job.shifts.forEach(shift => {
      shift.canceled = true;
    });

    this.jobRepository.save(job);
  }
}
