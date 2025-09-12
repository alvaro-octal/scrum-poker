import { Pipe, PipeTransform } from '@angular/core';
import { VoteValue } from '../../interfaces/room/round/vote/vote.interface';

@Pipe({
    name: 'optionRenderer'
})
export class OptionRendererPipe implements PipeTransform {
    transform(value: VoteValue): string {
        if (value === null) {
            return '☕';
        } else if (value === 0.5) {
            return '½';
        } else {
            return value.toString();
        }
    }
}
