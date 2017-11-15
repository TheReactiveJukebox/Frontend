import {Pipe, PipeTransform} from '@angular/core';

/*
This pipe is responsible for converting seconds to a date object which can then be
converted to a representation of minutes and seconds.
 */

@Pipe({name: 'mySecondsToDate'})
export class SecondsToDatePipe implements PipeTransform {
    public transform(seconds: number): Date {
        let date: Date = new Date(1970, 0, 1);
        date.setSeconds(seconds);
        return date;
    }


}
