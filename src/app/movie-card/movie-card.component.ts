import { Component } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MovieInfoComponent } from '../movie-info/movie-info.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenreInfoComponent } from '../genre-info/genre-info.component';
import { DirectorInfoComponent } from '../director-info/director-info.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent {
  movies: any[] = [];
  constructor(public fetchApiData: FetchApiDataService,
              public snackbar: MatSnackBar,
              public dialog: MatDialog) { }

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

  openMovieInfo(title: string, description: string): void {
    this.dialog.open(MovieInfoComponent, {
      data: {
        title: title,
        description: description
      }
    });
  }

  openGenreInfo(genre: any): void {
    console.log('Genre Object:', genre)
    this.dialog.open(GenreInfoComponent, {
      data: {
        genre: genre
      }
    });
  }

  openDirectorInfo(director: any): void {
    this.dialog.open(DirectorInfoComponent, {
      data: {
        name: director.name,
        Bio: director.bio,
        dateOfBirth: director.birth
      }
    });
  }

  // Function to add/remove movie to/from favorites
  toggleFavorite(movie: any): void {
    // Toggle the favorite status of the movie
    if (this.isMovieFavorite(movie)) {
      // Remove the movie from favorites locally
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.favoriteMovies = user.favoriteMovies.filter((id: string) => id !== movie._id);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      // Add the movie to favorites locally
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.favoriteMovies) {
        user.favoriteMovies.push(movie._id);
      } else {
        user.favoriteMovies = [movie._id];
      }
      localStorage.setItem('user', JSON.stringify(user));

      // Add the movie to favorites on the backend server
      this.fetchApiData.addFavoriteMovie(movie._id).subscribe(
        () => {
          console.log('Movie added to favorites successfully.');
        },
        (error) => {
          console.error('Error adding movie to favorites:', error);
        }
      );
    }

    // Update the local 'isFavorite' property to reflect the change
    movie.isFavorite = !this.isMovieFavorite(movie);
  }

  // Function to check if a movie is in favorites
  isMovieFavorite(movie: any): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.favoriteMovies && user.favoriteMovies.includes(movie._id);
  }
}
