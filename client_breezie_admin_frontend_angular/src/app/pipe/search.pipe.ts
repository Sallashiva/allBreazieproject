import { Pipe, PipeTransform } from '@angular/core';
import { EmployeeResponse } from '../models/employeeResponse';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(employee: EmployeeResponse[], searchString: string) {
    if (searchString) {
      return employee.filter(employee => {
        let fullName = employee.fullName.toLocaleLowerCase().includes(searchString.toLowerCase().replace(/\s/g, " "));
        return fullName;
      })
    } else {
      return employee;
    }
  }
}
