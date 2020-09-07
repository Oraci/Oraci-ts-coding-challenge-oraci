export class GetJobResponse {
  id: string;
  companyId: string;
  start: Date;
  end: Date;
  canceled: boolean;

  constructor(
    id: string,
    companyId: string,
    start: Date,
    end: Date,
    canceled: boolean,
  ) {
    this.id = id;
    this.companyId = companyId;
    this.start = start;
    this.end = end;
    this.canceled = canceled;
  }
}
