import { Utils } from './Utils';
import { IDate } from './interface/IDate';

const daysInMonth = (year: number, month: number): number => {
  year += Utils.div(month, 12);
  month = Utils.mod(month, 12);
  if (month < 0) {
    month += 12
    year -= 1
  }
  if (month < 6) {
    return 31;
  } else if (month < 11) {
    return 30;
  } else if (Utils.isLeapYear(year)) {
    return 30;
  }
  return 29;
}

const toJalali = (date: Date): IDate => {
  const jalali = Utils.toJalali(date);
  jalali.month -= 1;
  return jalali;
}

const toGregorian = (year: number, month: number, date: number): IDate => {
  const gregorian = Utils.toGregorian(year, month + 1, date);
  gregorian.month -= 1;
  return gregorian;
}

export {
  daysInMonth,
  toJalali,
  toGregorian
}
