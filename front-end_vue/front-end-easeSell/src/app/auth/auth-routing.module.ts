import { NgModule } from '@angular/core';
import {Routes, RouterModule } from '@angular/router';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { PublicGuard } from './guards';

const routes: Routes = [
  {
    path: '',
    component: LayoutPageComponent,
    children: [
      {
        path: 'login',
        canActivate:[PublicGuard],
        component: LoginPageComponent
      },
      {
        path: 'new-acount',
        canActivate:[PublicGuard],
        component: RegisterPageComponent
      },
      {
        path: '**',
        redirectTo: 'login'
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
export class AuthRoutingModule { }
