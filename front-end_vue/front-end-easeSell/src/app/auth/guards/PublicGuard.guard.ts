import { CanActivateChildFn, Router } from "@angular/router";
import { AuthService } from "../../auth/services/auth.service";
import { inject } from "@angular/core";

export const PublicGuard: CanActivateChildFn = (route, state) =>{



  const authService = inject(AuthService)
  const router = inject(Router)


  console.log(authService.isUserLoggedIn)


  if ( authService.isUserLoggedIn === true){
    router.navigate(['/'])
    return false
  }


  return true

  // get user(): boolean{
  //   return this.authService.isUserLoggedIn;
  // }

}
