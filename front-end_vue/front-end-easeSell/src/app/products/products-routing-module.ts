import { NgModule } from '@angular/core';
import {Routes, RouterModule } from '@angular/router';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ContactPageComponent } from './pages/contact-page/contact-page.component';
import { SellPageComponent } from './pages/sell-page/sell-page.component';
import { ExplorePageComponent } from './pages/explore-page/explore-page.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutPageComponent,
    children: [
      {
        path: '',
        component: HomePageComponent
      },
      {
        path: 'contact', component: ContactPageComponent
      },
      {
        path:'sell',
        component: SellPageComponent
      },
      {
        path:'explore',
        component:ExplorePageComponent
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
