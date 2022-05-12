import { Pipe, PipeTransform } from '@angular/core';
import { EmployeeResponse } from './RegisterModel/employeesResponse';
@Pipe({
  name: 'search',
  pure: false
})
export class SearchPipe implements PipeTransform {

  transform(employee: EmployeeResponse[], searchString: string) {
    if (searchString) {
      return employee.filter(employee => {
        let employeeName = employee.fullName.toLocaleLowerCase().includes(searchString.toLowerCase().replace(/\s/g, " "));
        return employeeName;
      })
    } else {
      return employee;
    }
  }
}
