import { Repository } from 'typeorm';
import { Shift } from './shift.entity';
import { ShiftService } from './shift.service';
import { ShiftController } from './shift.controller';
import { ResponseDto } from '../../utils/ResponseDto';
import { GetShiftsResponse } from './dto/GetShiftsResponse';
import { GetShiftResponse } from './dto/GetShiftResponse';

describe('ShiftContoller', () => {
  let shiftController;
  let shiftService;
  let shiftRepository;

  beforeEach(() => {
    shiftRepository = new Repository<Shift>();
    shiftService = new ShiftService(shiftRepository);
    shiftController = new ShiftController(shiftService);
  });

  describe('ShiftController', () => {
    it('should return an array of shifts', async () => {
      const shifts = [new Shift()];

      const result = new ResponseDto<GetShiftsResponse>(
        new GetShiftsResponse(
          shifts.map(shift => {
            return new GetShiftResponse(
              shift.id,
              shift.talentId,
              shift.jobId,
              shift.startTime,
              shift.endTime,
              shift.canceled,
            );
          }),
        ),
      );

      jest.spyOn(shiftService, 'getShifts').mockImplementation(() => shifts);

      expect(await shiftController.getShifts()).toStrictEqual(result);
    });
  });
});
