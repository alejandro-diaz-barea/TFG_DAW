import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Error404PageComponent } from './pages/error404-page/error404-page.component';
import { NavbarComponentComponent } from './components/navbar-component/navbar-component.component';
import { FooterComponentComponent } from './components/footer-component/footer-component.component';
import { ContactPageComponent } from './pages/contact-page/contact-page.component';



@NgModule({
  declarations: [
    Error404PageComponent,
    NavbarComponentComponent,
    FooterComponentComponent,
    ContactPageComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NavbarComponentComponent,
    FooterComponentComponent
  ]
})
export class SharedModule { }
