import { Pipe, PipeTransform } from '@angular/core';
import { number } from 'echarts';

@Pipe({
  name: 'shortText',
})
export class ShortTextPipe implements PipeTransform {
  transform(value: string | null): string | null {
    if (value === null) {
      return null;
    }
    if (value.length < 50) {
      return value;
    } else {
      return value.slice(0, 50) + '...';
    }
  }
}
