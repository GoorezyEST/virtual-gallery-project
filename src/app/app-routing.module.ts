import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExperienceComponent } from './experience/experience.component';
import { CardProjectComponent } from './gallery/card-project/card-project.component';
import { CubeProjectComponent } from './gallery/cube-project/cube-project.component';
import { GalleryComponent } from './gallery/gallery.component';
import { HoverProjectComponent } from './gallery/hover-project/hover-project.component';
import { NotFoundComponent } from './not-found/not-found.component';
const routes: Routes = [
  { path: '', component: ExperienceComponent, pathMatch: 'full' },
  { path: 'experience/gallery', component: GalleryComponent },
  { path: 'experience/gallery/project-card', component: CardProjectComponent },
  {
    path: 'experience/gallery/project-hover-lights',
    component: HoverProjectComponent,
  },
  { path: 'experience/gallery/project-cube', component: CubeProjectComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRouting {}
