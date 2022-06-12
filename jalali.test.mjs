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
      const dateFormat = 'YYYY/MM/DD';
      const dateTimeFormat = `${dateFormat} HH:mm:ss`;
      const jalali = Jalali.parse('1398/12/04');
      it('Same timestamp: 1582403400000', () => assert.equal(
        +jalali,
        1582403400000
      ));
      it("Same gregorian: '2020/02/23'", () => assert.equal(
        jalali.format(dateFormat, true),
        '2020/02/23'
      ));
      it("Is leap year: false", () => assert.equal(
        jalali.isLeapYear(),
        false
      ));
      it('Month length: 29', () => assert.equal(
        jalali.monthLength(),
        29
      ));
      it("Add 2 month + 1 week: '1399/02/11'", () => assert.equal(
        jalali.add(2, 'month').add(1, 'week').format(dateFormat),
        '1399/02/11'
      ));
      it("Start of week: '1399/02/06 00:00:00'", () => assert.equal(
        jalali.startOf('week').format(dateTimeFormat),
        '1399/02/06 00:00:00'
      ));
      it('Day of year: 37', () => assert.equal(
        jalali.dayOfYear(),
        37
      ));
      it("End of year: '1399/12/30 23:59:59'", () => assert.equal(
        jalali.endOf('year').format(dateTimeFormat),
        '1399/12/30 23:59:59'
      ));
      it("Is leap year: true", () => assert.equal(
        jalali.isLeapYear(),
        true
      ));
      it("Add 1 day + start of day: '1400-01-01 12:00:00 AM'", () => assert.equal(
        jalali.add(1, 'day').startOf('day').format('YYYY-MM-DD hh:mm:ss A'),
        '1400-01-01 12:00:00 AM'
      ));
    });

  });
});
