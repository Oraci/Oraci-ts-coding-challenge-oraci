import { JobController } from './job.controller';
import { JobService } from './job.service';
import { Repository } from 'typeorm';
import { Job } from './job.entity';
import { ResponseDto } from '../../utils/ResponseDto';
import { GetJobResponse } from './dto/GetJobResponse';
import { GetJobsResponse } from './dto/GetJobsResponse';
import { JobRequest } from './dto/JobRequest';
import { JobRequestResponse } from './dto/JobRequestResponse';

describe('JobController', () => {
  let jobController;
  let jobService;
  let jobRepository;

  beforeEach(() => {
    jobRepository = new Repository<Job>();
    jobService = new JobService(jobRepository);
    jobController = new JobController(jobService);
  });

  describe('JobController', () => {
    it('should return an array of jobs', async () => {
      const jobs = [new Job()];

      const result = new ResponseDto<GetJobsResponse>(
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

      jest.spyOn(jobService, 'getJobs').mockImplementation(() => jobs);

      expect(await jobController.getJobs()).toStrictEqual(result);
    });
  });

  it('should return a new job', async () => {
    const job = new Job();
    const jobRequest = new JobRequest();
    const result = new ResponseDto<JobRequestResponse>(
      new JobRequestResponse(job.id),
    );

    jest.spyOn(jobService, 'createJob').mockImplementation(() => job);

    expect(await jobController.requestJob(jobRequest)).toStrictEqual(result);
  });
});
