import { Injectable } from '@angular/core';
//import from rxjs
import { Observable, catchError, throwError } from 'rxjs';
//import from @angular/common/http
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
//import map
import { map } from 'rxjs/operators';

//Declaring the api url that will provide data for the client app
const apiUrl = 'https://movie-myflix-c346f5fde8cf.herokuapp.com/';

@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {}

  /**
   * User registration
   * @service POST to the respective endpoint of apiUrl to register a new user
   * @function userRegistration
   * @param {any} userDetails
   * @returns a new user object in json format
   */

  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(apiUrl + 'users', userDetails)
      .pipe(catchError(this.handleError));
  }

  /**
   * User login
   * @service POST to the respective endpoint of apiUrl to log in a new user
   * @function userLogin
   * @param {string} username
   * @param {string} password
   * @returns a user object in json format
   */

  public userLogin(username: string, password: string): Observable<any> {
    return this.http
      .post(apiUrl + 'login', { username, password })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get all movies
   * @service GET request to the respective endpoint of apiUrl to get all movies
   * @function getAllMovies
   * @returns a object with all the movies in json format
   */

  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get<Response>(apiUrl + 'movies', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Get one movie
   * @service GET request to the respective endpoint of apiUrl to get one movie
   * @function getOneMove
   * @returns a object of one movie in json format
   */

  getOneMove(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get<Response>(apiUrl + 'movies/' + title, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Get a director
   * @service GET request to the respective endpoint of apiUrl to get one director
   * @function findDirector
   * @returns a single object in JSON format
   */

  findDirector(directorName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get<Response>(apiUrl + '/movies/directors/' + directorName, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Get a genre
   * @service GET request to the respective endpoint of apiUrl to get one genre
   * @function genreInMovies
   * @returns a single object in JSON format
   */

  genreInMovies(genreName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get<Response>(apiUrl + '/movies/genres/' + genreName, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Get user info
   * @service GET request to the respective endpoint of apiUrl to get user info
   * @function getUserById
   * @returns a user object in JSON format
   */

  getUserById(id: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get<Response>(apiUrl + 'users/' + id, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Add movie to favorite list
   * @service POST request to the respective endpoint of apiUrl to add movie
   * @function addFavMovie
   * @param {string} movieId
   * @returns updated user object with added movie in favorite movies array in JSON format
   */

  addFavMovie(movieId: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    user.favouriteMovies.push(movieId);
    localStorage.setItem('user', JSON.stringify(user));

    return this.http
      .post(
        apiUrl + `users/${user._id}/${movieId}`,
        {},
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  /**
   * Update user info
   * @service POST request to the respective endpoint of apiUrl to update user info
   * @function updateUser
   * @param {any} updatedUser
   * @returns updated user object in JSON format
   */

  updateUser(updatedUser: any): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http
      .put<Response>(apiUrl + 'users/' + user._id, updatedUser, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(
        map(this.extractResponseData),
        catchError((err) => {
          console.log('Error: ' + err.error);
          console.log(err);
          if (
            err.error ===
            `Sorry the username ${user.username} is already taken.`
          ) {
            alert(err.error);
          } else {
            alert(err.error.errors[0].msg);
          }

          // return err;
          return '';
        })
      );
  }

  /**
   * Delete user
   * @service DELETE request to the respective endpoint of apiUrl to remove user
   * @function deleteUser
   * @returns success message if user gets deleted from database
   */

  deleteUser(id: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .delete<Response>(apiUrl + 'users/' + id, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Remove movie from favorite list
   * @service DELETE request to the respective endpoint of apiUrl to remove movie
   * @function delFavMovie
   * @param {string} movieId
   * @returns updated user object with removed movie in favorite movies array in JSON format
   */

  delFavMovie(movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const index = user.favouriteMovies.indexOf(movieId);
    if (index >= 0) {
      user.favouriteMovies.splice(index, 1);
    }
    localStorage.setItem('user', JSON.stringify(user));

    return this.http
      .delete(apiUrl + `users/${user._id}/${movieId}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get a list of movies by genre
   * @service GET request to the respective endpoint of apiUrl to get a list of movies from the same genre
   * @function getMoviesByGenre
   * @returns a list of movies with the genre selected in JSON format
   */

  getMoviesByGenre(genreName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get<Response>(apiUrl + '/movies/moviesbygenres/' + genreName, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Get a list of movies by director
   * @service GET request to the respective endpoint of apiUrl to get a list of movies from the same director
   * @function getMoviesByDirector
   * @returns a list of movies with the director selected in JSON format
   */

  getMoviesByDirector(directorName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get<Response>(apiUrl + '/movies/moviesbydirectors/' + directorName, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  public isFavoriteMovie(movieId: string): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user) {
      return user.favouriteMovies.includes(movieId);
    } else {
      return false;
    }
  }

  // Non-typed response extraction
  private extractResponseData(res: Response): any {
    const body = res;
    return body || {};
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` + `Error body is: ${error.error}`
      );
    }
    return throwError('Something bad happened; please try again later.');
  }
}
