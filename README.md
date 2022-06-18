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
- `a` meridian (am, pm)
- `A` meridian (AM, PM)

```typescript
import { Jalali } from 'jalali-ts';

Jalali.now().format('YYYY/MM/DD hh:mm:ss A');
```

# Parse date

To parse a jalali date you should follow `year month date [hours minutes seconds]` pattern:

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
```
