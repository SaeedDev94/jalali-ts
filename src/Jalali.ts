import { Utils } from './Utils';
import { IDate } from './interface/IDate';
import { IUnit } from './interface/IUnit';
import {
  monthLength,
  normalizeHours,
  normalizeMilliseconds,
  normalizeNumbers, throwError,
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
    public date: Date = new Date(),
    includeMS: boolean = true
  ) {
    if (Jalali.checkTimeZone) {
      const targetTimeZone: string = Jalali._timeZone ?? Jalali.defaultTimeZone;
      const systemTimeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (systemTimeZone !== targetTimeZone) {
        console.warn(`Your system time zone doesn't equal to '${targetTimeZone}', current: ${systemTimeZone}`);
        console.warn(`You may getting unexpected results (calculated timestamp)`);
      }
    }

    if (!includeMS) {
      this.date.setMilliseconds(0);
    }
  }

  static setTimeZone: boolean = true;
  static checkTimeZone: boolean = true;
  static set timeZone(value: string) {
    this._timeZone = value;
    if (this.setTimeZone && typeof process === 'object' && process?.release?.name === 'node') {
      process.env.TZ = value;
    }
  }
  static readonly defaultTimeZone: string = 'Asia/Tehran';
  private static _timeZone?: string;

  static parse(stringValue: string, includeMS: boolean = true): Jalali {
    const value: string = normalizeNumbers(stringValue);
    const matches: string[] = (value.match(/\d\d?\d?\d?/g) || []);
    const empty: string[] = new Array(7).fill('0');
    const [ year, month, date, hours, minutes, seconds, ms ] = [ ...matches, ...empty ]
      .slice(0, 7)
      .map((val: string, index: number): number => {
        let numberValue: number = Number(val);
        if (index === 3) numberValue = normalizeHours(value, Number(val));
        else if (index === 6) numberValue = normalizeMilliseconds(val);
        return numberValue;
      });

    if (!Utils.isValid(year, month, date, hours, minutes, seconds, ms)) throwError(stringValue);

    return new Jalali(Utils.toDate(year, month, date, hours, minutes, seconds, ms), includeMS);
  }

  static gregorian(stringValue: string, includeMS: boolean = true): Jalali {
    const value: string = normalizeNumbers(stringValue);
    const date = new Date(value);
    if (Number.isNaN(+date)) throwError(stringValue);
    return new Jalali(date, includeMS);
  }

  static timestamp(value: number, includeMS: boolean = true): Jalali {
    return new Jalali(new Date(value), includeMS);
  }

  static now(includeMS: boolean = true): Jalali {
    return new Jalali(new Date(), includeMS);
  }

  clone(includeMS: boolean = true): Jalali {
    return Jalali.timestamp(+this, includeMS);
  }

  valueOf(): number {
    return +this.date;
  }

  toString(): string {
    return this.format();
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

  getHours(): number {
    return this.date.getHours();
  }

  getMinutes(): number {
    return this.date.getMinutes();
  }

  getSeconds(): number {
    return this.date.getSeconds();
  }

  getMilliseconds(): number {
    return this.date.getMilliseconds();
  }

  setFullYear(value: number): Jalali {
    const jalaliDate = toJalali(this.date);
    const date: number = Math.min(jalaliDate.date, monthLength(value, jalaliDate.month));
    const gregorianDate = toGregorian(value, jalaliDate.month, date);
    this.update(gregorianDate);
    return this;
  }

  setMonth(value: number): Jalali {
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
    return this;
  }

  setDate(value: number): Jalali {
    const jalaliDate = toJalali(this.date);
    const gregorianDate = toGregorian(jalaliDate.year, jalaliDate.month, value);
    this.update(gregorianDate);
    return this;
  }

  setHours(value: number): Jalali {
    this.date.setHours(value);
    return this;
  }

  setMinutes(value: number): Jalali {
    this.date.setMinutes(value);
    return this;
  }

  setSeconds(value: number): Jalali {
    this.date.setSeconds(value);
    return this;
  }

  setMilliseconds(value: number): Jalali {
    this.date.setMilliseconds(value);
    return this;
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
    this.setHours(0).setMinutes(0).setSeconds(0).setMilliseconds(0);
    return this;
  }

  endOf(unit: IUnit): Jalali {
    this.startOf(unit).add(1, unit).setMilliseconds(-1);
    return this;
  }

  dayOfYear(): number;
  dayOfYear(value: number): Jalali;

  dayOfYear(value?: number): any {
    const jalali = this.clone();
    const startOfDay: number = +jalali.startOf('day');
    const startOfYear: number = +jalali.startOf('year');
    const dayOfYear: number =  Math.round((startOfDay - startOfYear) / 864e5) + 1;
    if (value === undefined) return dayOfYear;
    this.add(value - dayOfYear, 'day');
    return this;
  }

  format(format: string = 'YYYY/MM/DD HH:mm:ss', gregorian: boolean = false): string {
    let value: string = String(format);
    const ref = gregorian ? this.date : this;

    const year: number = ref.getFullYear();
    const month: number = ref.getMonth() + 1;
    const date: number = ref.getDate();

    let hours: number = ref.getHours();
    const minutes: number = ref.getMinutes();
    const seconds: number = ref.getSeconds();
    const ms: number = ref.getMilliseconds();

    if (format.includes('YYYY')) value = value.replace('YYYY', String(year));
    if (format.includes('MM')) value = value.replace('MM', zeroPad(month));
    if (format.includes('DD')) value = value.replace('DD', zeroPad(date));

    if (format.includes('HH')) value = value.replace('HH', zeroPad(hours));
    if (format.includes('mm')) value = value.replace('mm', zeroPad(minutes));
    if (format.includes('ss')) value = value.replace('ss', zeroPad(seconds));
    if (format.includes('SSS')) value = value.replace('SSS', zeroPad(ms, 3));

    if (format.includes('hh')) {
      const symbol = hours >= 12 ? 'pm' : 'am';
      if (format.includes('a')) value = value.replace('a', symbol);
      if (format.includes('A')) value = value.replace('A', symbol.toUpperCase());
      if (hours === 0) hours = 12;
      if (hours >= 13 && hours <= 23) hours -= 12;
      value = value.replace('hh', zeroPad(hours));
    }

    return value;
  }

  gregorian(format: string = 'YYYY-MM-DD HH:mm:ss'): string {
    return this.format(format, true);
  }

  private update(value: IDate): void {
    this.date = new Date(
      value.year, value.month, value.date,
      this.getHours(), this.getMinutes(), this.getSeconds(), this.getMilliseconds()
    );
  }

}
