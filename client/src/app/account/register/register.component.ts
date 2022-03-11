import { Component, OnInit } from '@angular/core';
import { AsyncValidatorFn, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map, of, switchMap, timer } from 'rxjs';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errors: string[];

  constructor(private fb: FormBuilder, private accountService: AccountService, private router: Router) { }

  ngOnInit(): void {
    this.createReisterForm();
  }

  createReisterForm() {
    //this.registerform == new form group
    this.registerForm = this.fb.group({
      displayName: [null, [Validators.required]],
      email: [null,
         [Validators.required, Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')],
         [this.validateEmailNotTaken()]
        ],
      password: [null, [Validators.required]]
    });
  }

  onSubmit() {
    this.accountService.register(this.registerForm.value).subscribe(response => {
      this.router.navigateByUrl('/shop');
    }, error => {
      console.log(error);
      //the errors array from the error response (check console)
      this.errors = error.errors;
    })
  }

  //Validate the email while typing
  validateEmailNotTaken(): AsyncValidatorFn {
    return control => {
      return timer(500).pipe(
        switchMap(() => {
          // if we don't have a value inside our control
          if (!control.value) {
            //return an observable of type null
            return of(null);
          }
          //if we do have a value and there has been a delay of 500ms
          //control.value = email address
          return this.accountService.checkEmailExists(control.value).pipe(
            map(res => {
              //emailExists is a name that we can make up ourselves to call the validator just like angular up here(check top) have called required required and pattern?, we are calling our one emailExsists
              //so when we use this inside our html template this is what we are going to reffer to, to check, to see if our validator has failed
              //if checkemailexists returns true(validation failed, email exists, show the error; otherwise return null)
              return res ? {emailExists: true} : null
            })
          );
        })
      );
    };
  }

}
