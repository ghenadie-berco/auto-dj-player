import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'songTime',
})
export class SongTimePipe implements PipeTransform {
  transform(seconds: number): string {
    const _minutes: number = Math.floor(seconds / 60);
    const _seconds: number = Math.floor(seconds % 60);
    return (
      _minutes.toString().padStart(2, '0') +
      ':' +
      _seconds.toString().padStart(2, '0')
    );
  }
}
