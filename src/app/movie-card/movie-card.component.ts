// src/app/movie-card/movie-card.component.ts
import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent {
  movies: any[] = [];
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getMovies();
  }

  /**
   * calls the getAllMovies API and returns the movies from the database
   */

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  openGenreDialog(genre: any): void {
    this.dialog.open(MovieDetailsComponent, {
      // width: '250px',
      data: {
        title: genre.genreName,
        content: genre.genreDescription,
      },
    });
  }

  openDirectorDialog(director: any): void {
    this.dialog.open(MovieDetailsComponent, {
      // width: '250px',
      data: {
        title: director.directorName,
        content: director.bio,
      },
    });
  }
  openSynopsisDialog(movie: any): void {
    this.dialog.open(MovieDetailsComponent, {
      // width: '250px',
      data: {
        title: 'Synopsis of ' + movie.title,
        content: movie.description,
      },
    });
  }

  isFavorite(favMovieId: string): boolean {
    return this.fetchApiData.isFavoriteMovie(favMovieId);
  }

  /**
   * calls the addFavMoie API adds movie to users favorites
   * @param {string} favMovieId of the movie selected
   */

  addFavMovie(favMovieId: string): void {
    this.fetchApiData.addFavMovie(favMovieId).subscribe(() => {
      console.log('addfavmovies called');

      this.snackBar.open('Added to favorites', 'OK', { duration: 2000 });
      console.log('addfavmovies called');
    });
  }

  /**
   * calls the delFavMovie API and removes a movie from users favorites
   * @param {string} favMovieId of the movie selected
   */

  removeFavMovie(favMovieId: string): void {
    this.fetchApiData.delFavMovie(favMovieId).subscribe(() => {
      this.snackBar.open('Removed movie from favorites', 'OK', {
        duration: 2000,
      });
    });
    console.log('removed fav movie');
  }
}
