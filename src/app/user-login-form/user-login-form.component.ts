// src/app/user-registration-form/user-registration-form.component.ts
import { Component, OnInit, Input } from '@angular/core';

// You'll use this import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// This import brings in the API calls we created in 6.2
import { FetchApiDataService } from '../fetch-api-data.service';

// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';

//for routing
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrl: './user-login-form.component.scss',
})
export class UserLoginFormComponent implements OnInit {
  @Input() userData = { username: '', password: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    public router: Router
  ) {}

  ngOnInit(): void {}

  /**
   * Sending the form inputs to the API to log in user
   * @function LoginUser
   */

  LoginUser(): void {
    this.fetchApiData
      .userLogin(this.userData.username, this.userData.password)
      .subscribe(
        (result) => {
          // Logic for a successful user login goes here! (To be implemented)
          this.dialogRef.close(); // This will close the modal on success!
          //test logging users info
          console.log(result);
          //use local storage
          localStorage.setItem('user', JSON.stringify(result.user));
          localStorage.setItem('token', result.token);
          this.snackBar.open('Hello ' + result.user.username + '!', 'OK', {
            duration: 2000,
          });
          this.router.navigate(['movies']);
        },
        (result) => {
          this.snackBar.open(result, 'OK', {
            duration: 2000,
          });
        }
      );
  }
}
