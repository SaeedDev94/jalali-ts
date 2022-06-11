import { Utils } from './Utils';
import { IDate } from './interface/IDate';

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

const monthLength = (year: number, month: number): number => {
  month = Utils.mod(month, 12);
  year += Utils.div(month, 12);
  if (month < 0) {
    month += 12
    year -= 1
  }
  return Utils.monthLength(year, month + 1);
}

const zeroPad = (value: number): string => String(value).padStart(2, '0');

export {
  toJalali,
  toGregorian,
  monthLength,
  zeroPad
}
