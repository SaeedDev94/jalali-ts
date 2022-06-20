import { strict as assert } from 'node:assert';
import { describe, it } from 'mocha';
import { Jalali } from '../dist/index.js';

describe('Jalali', () => {
  describe('Create new instance', () => {

    describe('Pass JS native date object to Jalali constructor', () => {
      const date = new Date();
      const jalali = new Jalali(date);
      it('+jalali === +date // true', () => assert.equal(+jalali === +date, true));
    });

    describe('Clone jalali', () => {
      const now = Jalali.now();
      const clone = now.clone();
      it("Shouldn't be same with its clone", () => assert.equal(now === clone, false));
      it('Should has same value', () => assert.equal(+now === +clone, true));
    });

    describe("Parse date: '1398/12/04'", () => {
      const jalali = Jalali.parse('1398/12/04');

      const valueOf = 1582403400000;
      it(
        `#valueOf: ${valueOf}`,
        () => assert.equal(jalali.valueOf(), valueOf)
      );

      const gregorian = '2020-02-23 00:00:00';
      it(
        `#gregorian: '${gregorian}'`,
        () => assert.equal(jalali.gregorian(), gregorian)
      );

      const toString = '1398/12/04 00:00:00';
      it(
        `#toString: ${toString}`,
        () => assert.equal(jalali.toString(), toString)
      );

      const is1398LeapYear = false;
      it(
        `#isLeapYear: ${is1398LeapYear}`,
        () => assert.equal(jalali.isLeapYear(), is1398LeapYear)
      );

      const monthLength = 29;
      it(
        `#monthLength: ${monthLength}`,
        () => assert.equal(jalali.monthLength(), monthLength)
      );

      const add2MonthAnd1Week = '1399/02/11 00:00:00';
      it(
        `#add(2, 'month').add(1, 'week'): '${add2MonthAnd1Week}'`,
        () => assert.equal(`${jalali.add(2, 'month').add(1, 'week')}`, add2MonthAnd1Week)
      );

      const startOfWeek = '1399/02/06 00:00:00';
      it(
        `#startOf('week') '${startOfWeek}'`,
        () => assert.equal(`${jalali.startOf('week')}`, startOfWeek)
      );

      const dayOfYear = 37;
      it(
        `#dayOfYear: ${dayOfYear}`,
        () => assert.equal(jalali.dayOfYear(), dayOfYear)
      );

      const endOfYear = '1399/12/30 23:59:59';
      it(
        `#endOf('year'): '${endOfYear}'`,
        () => assert.equal(`${jalali.endOf('year')}`, endOfYear)
      );

      const is1399LeapYear = true;
      it(
        `#isLeapYear: ${is1398LeapYear}`,
        () => assert.equal(jalali.isLeapYear(), is1399LeapYear)
      );

      const add1DayAndStartOfDay = '1400/01/01 00:00:00';
      it(
        `#add(1, 'day').startOf('day'): '${add1DayAndStartOfDay}'`,
        () => assert.equal(`${jalali.add(1, 'day').startOf('day')}`, add1DayAndStartOfDay)
      );
    });

    describe(`DateTime: '1398/12/04 02:30:07:05 PM'`, () => {
      const dateTime = Jalali.parse('1398/12/04 02:30:07:05 PM');

      it('#valueOf', () => assert.equal(+dateTime, 1582455607050));
      it('#getHours', () => assert.equal(dateTime.getHours(), 14));
      it('#getMinutes', () => assert.equal(dateTime.getMinutes(), 30));
      it('#getSeconds', () => assert.equal(dateTime.getSeconds(), 7));
      it('#getMilliseconds', () => assert.equal(dateTime.getMilliseconds(), 50));
      it('#gregorian', () => assert.equal(dateTime.gregorian('YYYY-MM-DD HH:mm:ss.SSS'), '2020-02-23 14:30:07.050'));
    });

    describe(`DateTime (No milliseconds): '1398/12/04 02:30:07:05 PM'`, () => {
      const dateTime = Jalali.parse('1398/12/04 02:30:07:05 PM', false);

      it('#valueOf', () => assert.equal(+dateTime, 1582455607000));
      it('#getMilliseconds', () => assert.equal(dateTime.getMilliseconds(), 0));
      it('#gregorian', () => assert.equal(dateTime.gregorian('YYYY-MM-DD HH:mm:ss.SSS'), '2020-02-23 14:30:07.000'));
    });

  });
});
