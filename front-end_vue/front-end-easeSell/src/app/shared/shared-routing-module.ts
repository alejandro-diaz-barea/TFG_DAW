import { NgModule } from '@angular/core';
import {Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: LayoutPageComponent,
    children: [
      {
        path: 'home', component: HomePageComponent
      },
      {
        path: '**',
        redirectTo: ''
      }
    ]
  }

];

@NgModule({
  imports: [
    RouterModule.forChild( routes)
  ],
  exports: [RouterModule],
})
export class ProductsRoutingModule { }
