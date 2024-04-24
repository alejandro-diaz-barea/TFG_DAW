import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { ProductsRoutingModule } from './products-routing-module';
import { SharedModule } from '../shared/shared.module';
import { ContactPageComponent } from './pages/contact-page/contact-page.component';



@NgModule({
  declarations: [
    HomePageComponent,
    LayoutPageComponent,
    ContactPageComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    SharedModule
    ]
})
export class ProductsModule { }
