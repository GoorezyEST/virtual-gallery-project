import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExperienceComponent } from './experience/experience.component';
import { CardProjectComponent } from './gallery/card-project/card-project.component';
import { GalleryComponent } from './gallery/gallery.component';
import { HeaderComponent } from './header/header.component';
import { NotFoundComponent } from './not-found/not-found.component';
const routes: Routes = [
  { path: '', component: HeaderComponent, pathMatch: 'full' },
  { path: 'experience', component: ExperienceComponent },
  { path: 'experience/gallery', component: GalleryComponent },
  { path: 'experience/gallery/project-card', component: CardProjectComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRouting {}
