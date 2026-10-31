import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'enumLabel', standalone: true })
export class EnumLabelPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    return value ? value.replace(/([a-z])([A-Z])/g, '$1 $2') : '';
  }
}
