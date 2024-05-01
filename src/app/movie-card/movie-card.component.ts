// src/app/movie-card/movie-card.component.ts
import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent {
  movies: any[] = [];
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getMovies();
  }

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
}
