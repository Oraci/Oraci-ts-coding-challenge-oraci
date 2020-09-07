import { GetJobResponse } from './GetJobResponse';

export class GetJobsResponse {
  jobs: GetJobResponse[];

  constructor(jobs: GetJobResponse[]) {
    this.jobs = jobs;
  }
}
