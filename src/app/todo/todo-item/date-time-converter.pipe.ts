import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateTimeConverter',
})
export class DateTimeConverterPipe implements PipeTransform {
  transform(input: string): string {
    const dateTimeParts = input.split('T');
    const datePart = dateTimeParts[0];
    const timePart = dateTimeParts[1].slice(0, 5);

    const dateParts = datePart.split('-');
    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];
    return `Date: ${day} - ${month} - ${year} <br> Time: ${timePart}`;
  }
}
