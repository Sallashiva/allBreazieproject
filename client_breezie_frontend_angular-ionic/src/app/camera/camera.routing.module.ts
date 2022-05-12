import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CameraComponent } from "./camera/camera.component";

const routes: Routes = [{
  path: 'camera',
  component: CameraComponent

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CameraRoutingModule {}
