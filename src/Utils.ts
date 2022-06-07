import { IDate } from './interface/IDate';

/**
 * Methods of Utils class grabbed from here:
 * https://github.com/jalaali/jalaali-js
 * Thanks to all contributors
 * https://github.com/jalaali
 */
export class Utils {

  private static breaks: number[] = [
    -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210,
    1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178
  ];

  static toJalali(date: Date): IDate;
  static toJalali(year: number, month: number, day: number): IDate;

  static toJalali(arg1: Date | number, arg2?: number, arg3?: number): IDate {
    const gregorian: Date | null = arg1 instanceof Date ? arg1 : null;
    const year: number = gregorian ? gregorian.getFullYear() : <number>arg1;
    const month: number = gregorian ? gregorian.getMonth() + 1 : <number>arg2;
    const date: number = gregorian ? gregorian.getDate() : <number>arg3;
    const julian: number = this.gregorianToJulian(year, month, date);

    return this.julianToJalali(julian);
  }

  static toGregorian(year: number, month: number, date: number): IDate {
    const julian: number = this.jalaliToJulian(year, month, date);

    return this.julianToGregorian(julian);
  }

  static isValid(year: number, month: number, date: number): boolean {
    return  year >= -61 && year <= 3177 &&
      month >= 1 && month <= 12 &&
      date >= 1 && date <= this.monthLength(year, month);
  }

  static isLeapYear(year: number): boolean {
    return this.calculateLeap(year) === 0;
  }

  static monthLength(year: number, month: number): number {
    if (month <= 6) return 31;
    if (month <= 11) return 30;
    if (this.isLeapYear(year)) return 30;
    return 29;
  }

  static calculateLeap(year: number, calculated?: {jp: number, jump: number}): number {
    const bl: number = this.breaks.length;
    let jp: number = calculated ? calculated.jp : this.breaks[0];
    let jump: number = calculated ? calculated.jump : 0;

    if (!calculated) {
      if (year < jp || year >= this.breaks[bl - 1]) {
        throw new Error(`Invalid Jalali year ${year}`);
      }

      for (let i = 1 ; i < bl ; i++) {
        const jm = this.breaks[i];
        jump = jm - jp;
        if (year < jm) break;
        jp = jm;
      }
    }

    let n: number = year - jp;
    if (jump - n < 6) {
      n = n - jump + this.div(jump + 4, 33) * 33
    }

    let leap: number = this.mod(this.mod(n + 1, 33) - 1, 4)
    if (leap === -1) {
      leap = 4
    }

    return leap;
  }

  static calculateJalai(year: number, calculateLeap: boolean = true): {
    gregorianYear: number,
    march: number,
    leap: number
  } {
    const bl: number = this.breaks.length;
    const gregorianYear: number = year + 621;
    let leapJ: number = -14;
    let jp: number = this.breaks[0];

    if (year < jp || year >= this.breaks[bl - 1]) {
      throw new Error(`Invalid Jalali year ${year}`);
    }

    let jump: number = 0;
    for (let i = 1 ; i < bl ; i++) {
      const jm = this.breaks[i];
      jump = jm - jp;
      if (year < jm) break;
      leapJ = leapJ + this.div(jump, 33) * 8 + this.div(this.mod(jump, 33), 4);
      jp = jm;
    }

    let n: number = year - jp;
    leapJ = leapJ + this.div(n, 33) * 8 + this.div(this.mod(n, 33) + 3, 4);
    if (this.mod(jump, 33) === 4 && (jump - n) === 4) {
      leapJ += 1
    }

    const leapG: number = this.div(gregorianYear, 4) - this.div((this.div(gregorianYear, 100) + 1) * 3, 4) - 150;
    const march: number = 20 + leapJ - leapG;

    return {
      gregorianYear,
      march,
      leap: calculateLeap ? this.calculateLeap(year, {jp, jump}) : -1
    };
  }

  static jalaliToJulian(year: number, month: number, date: number): number {
    const r = this.calculateJalai(year, false);

    return this.gregorianToJulian(r.gregorianYear, 3, r.march) + (month - 1) * 31 - this.div(month, 7) * (month - 7) + date - 1;
  }

  static julianToJalali(julian: number): IDate {
    const gregorian = this.julianToGregorian(julian);
    let year: number = gregorian.year - 621;

    const r = this.calculateJalai(year);
    const julian1F: number = this.gregorianToJulian(gregorian.year, 3, r.march);

    let k: number = julian - julian1F;
    if (k >= 0) {
      if (k <= 185) {
        return {
          year,
          month: 1 + this.div(k, 31),
          date: this.mod(k, 31) + 1
        };
      } else {
        k -= 186;
      }
    } else {
      year -= 1;
      k += 179;
      if (r.leap === 1) k += 1;
    }

    return {
      year,
      month: 7 + this.div(k, 30),
      date: this.mod(k, 30) + 1
    };
  }

  static gregorianToJulian(year: number, month: number, date: number): number {
    const julian: number = this.div((year + this.div(month - 8, 6) + 100100) * 1461, 4)
      + this.div(153 * this.mod(month + 9, 12) + 2, 5)
      + date - 34840408;

    return (julian - this.div(this.div(year + 100100 + this.div(month - 8, 6), 100) * 3, 4) + 752);
  }

  static julianToGregorian(julian: number): IDate {
    let j: number = 4 * julian + 139361631;
    j = j + this.div(this.div(4 * julian + 183187720, 146097) * 3, 4) * 4 - 3908;

    const i: number = this.div(this.mod(j, 1461), 4) * 5 + 308;

    const date: number = this.div(this.mod(i, 153), 5) + 1;
    const month: number = this.mod(this.div(i, 153), 12) + 1;
    const year: number = this.div(j, 1461) - 100100 + this.div(8 - month, 6);

    return { year, month, date };
  }

  static jalaliWeek(year: number, month: number, date: number): {
    saturday: IDate,
    friday: IDate
  } {
    const dayOfWeek: number = this.toDate(year, month, date).getDay();

    const startDayDifference: number = dayOfWeek === 6 ? 0 : -(dayOfWeek + 1);
    const endDayDifference: number = 6 + startDayDifference;

    return {
      saturday: this.julianToJalali(this.jalaliToJulian(year, month, date + startDayDifference)),
      friday: this.julianToJalali(this.jalaliToJulian(year, month, date + endDayDifference))
    }
  }

  static toDate(year: number, month: number, date: number, hours: number = 0, minutes: number = 0, seconds: number = 0, ms: number = 0): Date {
    const gregorian = this.toGregorian(year, month, date);

    return new Date(gregorian.year, gregorian.month - 1, gregorian.date, hours, minutes, seconds, ms);
  }

  static div(a: number, b: number): number {
    return ~~(a / b);
  }

  static mod(a: number, b: number): number {
    return a - ~~(a / b) * b;
  }

}
