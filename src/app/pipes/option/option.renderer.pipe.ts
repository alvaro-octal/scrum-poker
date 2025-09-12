import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'optionRenderer',
    standalone: false
})
export class OptionRendererPipe implements PipeTransform {
    transform(value: number | null): string {
        if (value === null) {
            return '☕';
        } else if (value === 0.5) {
            return '½';
        } else {
            return value.toString();
        }
    }
}
