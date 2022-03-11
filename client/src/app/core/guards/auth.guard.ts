import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private accountService: AccountService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    //no need to subscribe to this observable because the router is taking care of this
    return this.accountService.currentUser$.pipe(
      map(auth => {
        //if we have auth/if we are logged in
        if (auth) {
          return true;
        }
        //if auth = null means we are not logged in
        //returnUrl = checkout URL(the checkout page can will trigger an error if the user is not logged in)
        this.router.navigate(['account/login'], { queryParams: { returnUrl: state.url } });
      })
    )
  }

}
