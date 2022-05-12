import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'logoutsearch'
})
export class LogoutsearchPipe implements PipeTransform {

  transform(logoutdetails,seachbar): any {
    if(!logoutdetails||!seachbar) {
      return logoutdetails;
   }
   return logoutdetails.filter((res)=>{
     return res.FullName.toLowerCase().indexOf(seachbar.toLowerCase()) !== -1;
   })
  }

}
