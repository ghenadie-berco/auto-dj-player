import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'storageSize',
})
export class StorageSizePipe implements PipeTransform {
  transform(sizeInBytes: number): string {
    if (sizeInBytes === 0) {
      return '0 Bytes';
    }

    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const k = 1024;
    let i = 0;
    
    while (sizeInBytes >= k && i < units.length - 1) {
      sizeInBytes /= k;
      i++;
    }

    return `${Math.round(sizeInBytes * 100) / 100} ${units[i]}`;
  }
}
