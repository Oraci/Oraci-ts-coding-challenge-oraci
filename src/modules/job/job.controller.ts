import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  HttpCode,
  ParseUUIDPipe,
  UseFilters,
} from '@nestjs/common';
import { v4 as UUIDv4 } from 'uuid';
import { JobService } from './job.service';
import { ResponseDto } from '../../utils/ResponseDto';
import { ValidationPipe } from '../ValidationPipe';
import { JobRequest } from './dto/JobRequest';
import { JobRequestResponse } from './dto/JobRequestResponse';
import { GetJobsResponse } from './dto/GetJobsResponse';
import { GetJobResponse } from './dto/GetJobResponse';
import { HttpExceptionFilter } from '../filters/http-exception.filter';

@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get()
  async getJobs(): Promise<ResponseDto<GetJobsResponse>> {
    const jobs = await this.jobService.getJobs();
    return new ResponseDto<GetJobsResponse>(
      new GetJobsResponse(
        jobs.map(job => {
          return new GetJobResponse(
            job.id,
            job.companyId,
            job.startTime,
            job.endTime,
            job.canceled,
          );
        }),
      ),
    );
  }

  @Post()
  async requestJob(
    @Body(new ValidationPipe<JobRequest>())
    dto: JobRequest,
  ): Promise<ResponseDto<JobRequestResponse>> {
    const job = await this.jobService.createJob(UUIDv4(), dto.start, dto.end);
    return new ResponseDto<JobRequestResponse>(new JobRequestResponse(job.id));
  }

  @Patch(':jobId/cancel')
  @HttpCode(204)
  @UseFilters(HttpExceptionFilter)
  async cancelJob(
    @Param('jobId', new ParseUUIDPipe()) jobId: string,
  ): Promise<void> {
    return this.jobService.cancelJob(jobId);
  }
}
