import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, of, ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUser } from '../shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baserUrl = environment.apiUrl;
  //replaysubject holds 1 value(1 user object) and it's caching this so it can always be available(even when refreshing page).
  //we can stil use currentUserSource.next(user) on this to set the next value of this subject
  //auth guard is gonna wait until the replaysubject has something before it continues(it's either a currentUser$ or it isn't)
  private currentUserSource = new ReplaySubject<IUser>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }


  loadCurrentUser(token: string) {
    if(token === null) {
      this.currentUserSource.next(null);
      return of(null);
    }
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.get(this.baserUrl + 'account', {headers}).pipe(
      //map the user object we receive into the currentUser$(observable)
      map((user: IUser) => {
        if (user) {
          //this is needed because we get a new token from the API
          localStorage.setItem('token', user.token);
          //update the observable and pass in the user
          this.currentUserSource.next(user);
        }
      })
    )
  }

  login(values: any) {
    //get the response from the api
    return this.http.post(this.baserUrl + 'account/login', values).pipe(
      //get the user back from the server
      map((user: IUser) => {
        //if the user exists
        if (user) {
          // store the token in the localstorage so the user stays logged in in the browser
          localStorage.setItem('token', user.token);
          //store the user in the curentusersource, in this service? / currentUserSource then becomes "user"
          this.currentUserSource.next(user);
        }
      })
    );
  }

  register(values: any) {
    return this.http.post(this.baserUrl + 'account/register', values).pipe(
      map((user: IUser) => {
        if(user) {
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
        }
      })
    )
  }

  logout() {
    //remove the token from the browser (localstorage)
    localStorage.removeItem('token');
    // remove the user from the currentUserSource variable
    this.currentUserSource.next(null);
    //redirect the user to the home page
    this.router.navigateByUrl('/');
  }

  checkEmailExists(email: string) {
    return this.http.get(this.baserUrl + 'account/emailexists?email=' + email);
  }
}
