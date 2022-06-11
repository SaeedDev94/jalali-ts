import { Utils } from './Utils';
import { IDate } from './interface/IDate';
import { IUnit } from './interface/IUnit';
import {
  monthLength,
  normalizeHours,
  normalizeNumbers,
  toGregorian,
  toJalali,
  zeroPad
} from './helpers';

/**
 * Inspired by:
 * https://github.com/jalaali/moment-jalaali
 * Thanks to all contributors
 * https://github.com/jalaali
 */
export class Jalali {

  constructor(
    public date: Date = new Date()
  ) {
  }

  static parse(value: string, gregorian: boolean = false): Jalali {
    const throwError = () => {throw new Error(`Invalid: ${value}`)};

    if (gregorian) {
      const date = new Date(value);
      if (Number.isNaN(date.valueOf())) throwError();
      return new Jalali(date);
    }

    let newValue: string = normalizeNumbers(value);
    const fourDigits: RegExp = /\d{4}/g;
    const oneOrTwoDigits: RegExp = /\d\d?/g;
    const extract = (pattern: RegExp): number => {
      const stringValue = newValue.match(pattern)?.shift();
      const numberValue = Number(stringValue);
      if (Number.isNaN(numberValue)) return 0;
      if (stringValue) newValue = newValue.replace(stringValue, '');
      return numberValue;
    };

    const year: number = extract(fourDigits);
    const month: number = extract(oneOrTwoDigits);
    const date: number = extract(oneOrTwoDigits);

    if (!Utils.isValid(year, month, date)) throwError();

    const hours: number = normalizeHours(value, extract(oneOrTwoDigits));
    const minutes: number = extract(oneOrTwoDigits);
    const seconds: number = extract(oneOrTwoDigits);
    const ms: number = 0;

    const invalidHours: boolean = hours < 0 || hours > 23;
    const invalidMinutes: boolean = minutes < 0 || minutes > 59;
    const invalidSeconds: boolean = seconds < 0 || seconds > 59;

    if (invalidHours || invalidMinutes || invalidSeconds) throwError();

    return new Jalali(Utils.toDate(year, month, date, hours, minutes, seconds, ms));
  }

  static timestamp(value: number): Jalali {
    return new Jalali(new Date(value));
  }

  private update(value: IDate): void {
    this.date = new Date(
      value.year, value.month, value.date,
      this.date.getHours(), this.date.getMinutes(), this.date.getSeconds(), this.date.getMilliseconds()
    );
  }

  clone(): Jalali {
    return new Jalali(this.date);
  }

  valueOf(): number {
    return this.date.valueOf();
  }

  getFullYear(): number {
    return toJalali(this.date).year;
  }

  getMonth(): number {
    return toJalali(this.date).month;
  }

  getDate(): number {
    return toJalali(this.date).date;
  }

  setFullYear(value: number): void {
    const jalaliDate = toJalali(this.date);
    const date: number = Math.min(jalaliDate.date, monthLength(value, jalaliDate.month));
    const gregorianDate = toGregorian(value, jalaliDate.month, date);
    this.update(gregorianDate);
  }

  setMonth(value: number): void {
    const jalaliDate = toJalali(this.date);
    const date: number = Math.min(jalaliDate.date, monthLength(jalaliDate.year, value));
    this.setFullYear(jalaliDate.year + Utils.div(value, 12));
    value = Utils.mod(value, 12);
    if (value < 0) {
      value += 12;
      this.add(-1, 'year');
    }
    const gregorianDate = toGregorian(this.getFullYear(), value, date);
    this.update(gregorianDate);
  }

  setDate(value: number): void {
    const jalaliDate = toJalali(this.date);
    const gregorianDate = toGregorian(jalaliDate.year, jalaliDate.month, value);
    this.update(gregorianDate);
  }

  isLeapYear(): boolean {
    return Utils.isLeapYear(toJalali(this.date).year);
  }

  monthLength(): number {
    const jalaliDate = toJalali(this.date);
    return monthLength(jalaliDate.year, jalaliDate.month);
  }

  add(value: number, unit: IUnit): Jalali {
    switch (unit) {
      case 'year':
        this.setFullYear(this.getFullYear() + value);
        break;
      case 'month':
        this.setMonth(this.getMonth() + value);
        break;
      case 'week':
        this.date.setDate(this.date.getDate() + (value * 7));
        break;
      case 'day':
        this.date.setDate(this.date.getDate() + value);
        break;
    }
    return this;
  }

  startOf(unit: IUnit): Jalali {
    if (unit === 'year') {
      this.setMonth(0);
    }
    if (unit === 'year' || unit === 'month') {
      this.setDate(1);
    }
    if (unit === 'week') {
      const dayOfDate: number = this.date.getDay();
      const startOfWeek: number = this.date.getDate() - (dayOfDate === 6 ? 0 : this.date.getDay() + 1);
      this.date.setDate(startOfWeek);
    }

    this.date.setHours(0);
    this.date.setMinutes(0);
    this.date.setSeconds(0);
    this.date.setMilliseconds(0);

    return this;
  }

  endOf(unit: IUnit): Jalali {
    this.startOf(unit);
    this.add(1, unit);
    this.date.setMilliseconds(-1);
    return this;
  }

  dayOfYear(): number;
  dayOfYear(value: number): Jalali;

  dayOfYear(value?: number): any {
    const jalali = this.clone();
    jalali.startOf('day');
    const startOfDay: number = jalali.date.valueOf();
    jalali.startOf('year');
    const startOfYear: number = jalali.date.valueOf();
    const dayOfYear: number =  Math.round((startOfDay - startOfYear) / 864e5) + 1;
    if (value === undefined) {
      return dayOfYear;
    }
    this.add(value - dayOfYear, 'day');
    return this;
  }

  format(format: string, gregorian: boolean = false): string {
    let value: string = String(format);
    const ref = gregorian ? this.date : this;

    const year: number = ref.getFullYear();
    const month: number = ref.getMonth() + 1;
    const date: number = ref.getDate();

    let hours: number = this.date.getHours();
    const minutes: number = this.date.getMinutes();
    const seconds: number = this.date.getSeconds();

    if (format.indexOf('YYYY') !== -1) value = value.replace('YYYY', String(year));
    if (format.indexOf('MM') !== -1) value = value.replace('MM', zeroPad(month));
    if (format.indexOf('DD') !== -1) value = value.replace('DD', zeroPad(date));

    if (format.indexOf('HH') !== -1) value = value.replace('HH', zeroPad(hours));
    if (format.indexOf('mm') !== -1) value = value.replace('mm', zeroPad(minutes));
    if (format.indexOf('ss') !== -1) value = value.replace('ss', zeroPad(seconds));

    if (format.indexOf('hh') !== -1) {
      const symbol = hours >= 12 ? 'pm' : 'am';
      if (format.indexOf('a') !== -1) value = value.replace('a', symbol);
      if (format.indexOf('A') !== -1) value = value.replace('A', symbol.toUpperCase());
      if (hours === 0) hours = 12;
      if (hours >= 13 && hours <= 23) hours -= 12;
      value = value.replace('hh', zeroPad(hours));
    }

    return value;
  }

}
