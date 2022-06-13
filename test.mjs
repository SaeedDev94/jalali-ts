import { strict as assert } from 'node:assert';
import { describe, it } from 'mocha';
import { Jalali } from './dist/index.js';

describe('Jalali', () => {
  describe('Create new instance', () => {

    describe('Pass JS native date object to Jalali constructor', () => {
      const date = new Date();
      const jalali = new Jalali(date);
      it('+jalali === +date // true', () => assert.equal(+jalali === +date, true));
    });

    describe("Parse date: '1398/12/04'", () => {
      const jalali = Jalali.parse('1398/12/04');

      const timestamp = 1582403400000;
      it(`Same timestamp: ${timestamp}`, () => assert.equal(+jalali, timestamp));

      const gregorian = '2020-02-23 00:00:00';
      it(`Same gregorian: '${gregorian}'`, () => assert.equal(jalali.gregorian(), gregorian));

      const is1398LeapYear = false;
      it(`Is leap year: ${is1398LeapYear}`, () => assert.equal(jalali.isLeapYear(), is1398LeapYear));

      const monthLength = 29;
      it(`Month length: ${monthLength}`, () => assert.equal(jalali.monthLength(), 29));

      const add2MonthAnd1Week = '1399/02/11 00:00:00';
      it(`Add 2 month + 1 week: '${add2MonthAnd1Week}'`, () => assert.equal(jalali.add(2, 'month').add(1, 'week').format(), add2MonthAnd1Week));

      const startOfWeek = '1399/02/06 00:00:00';
      it(`Start of week: '${startOfWeek}'`, () => assert.equal(jalali.startOf('week').format(), startOfWeek));

      const dayOfYear = 37;
      it(`Day of year: ${dayOfYear}`, () => assert.equal(jalali.dayOfYear(), dayOfYear));

      const endOfYear = '1399/12/30 23:59:59';
      it(`End of year: '${endOfYear}'`, () => assert.equal(jalali.endOf('year').format(), endOfYear));

      const is1399LeapYear = true;
      it(`Is leap year: ${is1398LeapYear}`, () => assert.equal(jalali.isLeapYear(), is1399LeapYear));

      const add1DayAndStartOfDay = '1400/01/01 00:00:00';
      it(`Add 1 day + start of day: '${add1DayAndStartOfDay}'`, () => assert.equal(jalali.add(1, 'day').startOf('day').format(), add1DayAndStartOfDay));
    });

  });
});
