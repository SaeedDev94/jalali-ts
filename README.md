# jalali-ts

Parse and interact with jalali date  
This lib inspired by **[moment-jalaali](https://github.com/jalaali/moment-jalaali)**  
Thanks to all contributors

# Why jalali-ts? 

You may ask yourself we already have `moment-jalaali` which is even more powerful in some cases!

**So why `jalali-ts`?**  
Because `moment` is a legacy project and according to its document you should avoid using it in the new projects!

Pros:

- No dependencies!
- TypeScript
- Modern JavaScript (ES2020)

Cons:

- Limitation for parsing input date
- Limitation for output format

# Install

```bash
npm install jalali-ts
```

# Supported formats

- `YYYY` year
- `MM` month
- `DD` date
- `HH` hours (standard 24h)
- `hh` hours (12h format)
- `mm` minutes
- `ss` seconds
- `SSS` milliseconds
- `a` meridian (am, pm)
- `A` meridian (AM, PM)

```typescript
import { Jalali } from 'jalali-ts';

Jalali.now().format('YYYY/MM/DD hh:mm:ss A');
```

# Parse date

To parse a jalali date you should follow `year month date [hours minutes seconds ms]` pattern:

```typescript
import { Jalali } from 'jalali-ts';

const jalali = Jalali.parse('1398/12/04');

jalali.valueOf(); // 1582403400000
jalali.gregorian(); // 2020-02-23 00:00:00
jalali.toString(); // 1398/12/04 00:00:00
jalali.isLeapYear(); // false
jalali.monthLength(); // 29
jalali.add(2, 'month').add(1, 'week'); // 1399/02/11 00:00:00
jalali.startOf('week'); // 1399/02/06 00:00:00
jalali.dayOfYear(); // 37
jalali.endOf('year'); // 1399/12/30 23:59:59
jalali.isLeapYear(); // true
jalali.add(1, 'day').startOf('day'); // 1400/01/01 00:00:00

const dateTime = Jalali.parse('1398/12/04 02:30:07:05 PM');
dateTime.valueOf(); // 1582455607050
dateTime.getHours(); // 14
dateTime.getMinutes(); // 30
dateTime.getSeconds(); // 7
dateTime.getMilliseconds(); // 50
dateTime.gregorian('YYYY-MM-DD HH:mm:ss.SSS'); // 2020-02-23 14:30:07.050

const dateTimeNoMilliseconds = Jalali.parse('1398/12/04 02:30:07:05 PM', false);
dateTimeNoMilliseconds.valueOf(); // 1582455607000
dateTimeNoMilliseconds.getMilliseconds(); // 0
dateTimeNoMilliseconds.gregorian('YYYY-MM-DD HH:mm:ss.SSS'); // 2020-02-23 14:30:07.000
```

# Time Zone

If you rely on timestamp please make sure your environment time zone is correct:

```typescript
process.env.TZ = 'UTC'; // The default time zone for servers!
+Jalali.parse('1399-02-02 08:30:00 PM'); // 1587501000000

process.env.TZ = 'Asia/Tehran';
+Jalali.parse('1399-02-02 08:30:00 PM'); // 1587484800000
```

As you can see there is `16200000` ms offset (`UTC+04:30`) for a same datetime string!  
`jalali-ts` checks your system time zone and if it's not equal to `Jalali.defaultTimeZone = 'Asia/Tehran'` it will print a warning about it.  
To disable time zone check:

```typescript
Jalali.checkTimeZone = false;
```

If you want to change time zone value:

```typescript
Jalali.timeZone = 'Asia/Kabul';
```

> **Note**  
> If running env is node `Jalali.timeZone = 'value'`  
> Will change system time zone!  
> If you don't want `jalali-ts` touch your system time zone (node process):  
> ```typescript
> Jalali.setTimeZone = false;
> ```
