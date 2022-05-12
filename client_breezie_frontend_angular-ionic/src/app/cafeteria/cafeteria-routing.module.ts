import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CafeteriaHomeComponent } from './cafeteria-home/cafeteria-home.component';
import { CafeteriaPage } from './cafeteria.page';
import { DurationpageComponent } from './durationpage/durationpage.component';
import { FoodsComponent } from './foods/foods.component';
import { LastpageComponent } from './lastpage/lastpage.component';

const routes: Routes = [{
    path: '',
    component: CafeteriaPage
  },
  {
    path: 'cafeteria-item',
    component: CafeteriaHomeComponent
  },
  {
    path: 'foods',
    component: FoodsComponent
  },
  {
    path: 'duration',
    component: DurationpageComponent
  },
  {
    path: 'thankyou',
    component: LastpageComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CafeteriaPageRoutingModule {}
