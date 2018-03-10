import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'awesome'
})
export class AwesomePipe implements PipeTransform {

  transform(phrase: string): any {
    return phrase ? 'Awesome ' + phrase : '';
  }

}
