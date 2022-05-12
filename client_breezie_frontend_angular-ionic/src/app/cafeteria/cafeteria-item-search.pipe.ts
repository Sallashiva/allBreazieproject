import { Pipe, PipeTransform } from '@angular/core';
import { CafeteriaResponse } from './model/cafeteriaresponce';

@Pipe({
  name: 'cafeteriaItemSearch',
  pure: false
})

export class CafeteriaItemSearchPipe implements PipeTransform {

  transform(cafeteriaa: CafeteriaResponse[], searchString: string) {
    if (searchString) {
      return cafeteriaa.filter(refreshment => {
        let cafeteriaitem = refreshment.name.toLocaleLowerCase().includes(searchString.toLocaleLowerCase().replace(/\s/g, ""));
        return cafeteriaitem;
      })
    } else {
      return cafeteriaa;
    }
  }
}
