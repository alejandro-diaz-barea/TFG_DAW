import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { ProductsRoutingModule } from './products-routing-module';
import { SharedModule } from '../shared/shared.module';
import { ContactPageComponent } from './pages/contact-page/contact-page.component';
import { SellPageComponent } from './pages/sell-page/sell-page.component';
import { ExplorePageComponent } from './pages/explore-page/explore-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MessagePageComponent } from './pages/message-page/message-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';



@NgModule({
  declarations: [
    HomePageComponent,
    LayoutPageComponent,
    ContactPageComponent,
    SellPageComponent,
    ExplorePageComponent,
    MessagePageComponent,
    ProfilePageComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    SharedModule,
    ReactiveFormsModule
    ]
})
export class ProductsModule { }
