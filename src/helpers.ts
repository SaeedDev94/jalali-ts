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

const normalizeNumbers = (date: string): string => {
  const persianNumbers = new Map<string, string>();
  persianNumbers.set('۰', '0');
  persianNumbers.set('۱', '1');
  persianNumbers.set('۲', '2');
  persianNumbers.set('۳', '3');
  persianNumbers.set('۴', '4');
  persianNumbers.set('۵', '5');
  persianNumbers.set('۶', '6');
  persianNumbers.set('۷', '7');
  persianNumbers.set('۸', '8');
  persianNumbers.set('۹', '9');

  return String(date).split('').map((char: string) => persianNumbers.get(char) ?? char).join('');
}

const normalizeHours = (date: string, hours: number): number => {
  let meridian: 'am' | 'pm' | null = null;
  if (String(date).toLowerCase().includes('am')) meridian = 'am';
  if (String(date).toLowerCase().includes('pm')) meridian = 'pm';

  if (meridian === 'am' && hours === 12) return 0;
  if (meridian === 'pm' && (hours >= 1 && hours <= 11)) return hours + 12;

  return (meridian !== null && hours > 12) ? -1 : hours;
}

const zeroPad = (value: number): string => String(value).padStart(2, '0');

export {
  toJalali,
  toGregorian,
  monthLength,
  normalizeNumbers,
  normalizeHours,
  zeroPad
}
