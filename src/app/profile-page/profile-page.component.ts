import { Component, Input, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';

type User = {
  _id?: string;
  username?: string;
  password?: string;
  email?: string;
  birthday?: string;
  favouriteMovies?: [];
};

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent {
  user: User = {};

  @Input() userData = { username: '', password: '', email: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public router: Router
  ) {}

  ngOnInit(): void {
    const user = this.getUser();

    if (!user._id) {
      this.router.navigate(['welcome']);
      return;
    }

    this.user = user;
    this.userData = {
      username: user.username || '',
      password: '',
      email: user.email || '',
    };
  }

  getUser(): User {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  /**
   * calls the updateUser API and updates the users information in the database
   * @function editUser
   */

  editUser(): void {
    this.fetchApiData.updateUser(this.userData).subscribe((result) => {
      localStorage.setItem('user', JSON.stringify(result));

      // testing:
      console.log('updateUser called');
      console.log('result:', result);
      alert('Update was succesful ' + result.username + '!');

      this.user = result;
    });
  }
}
