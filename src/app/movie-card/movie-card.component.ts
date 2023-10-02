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
    this.updateUserFavorites(); // Update user favorites on component initialization
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

  toggleFavorite(movie: any): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (this.isMovieFavorite(movie)) {
      user.favoriteMovies = user.favoriteMovies.filter((id: string) => id !== movie._id);
      localStorage.setItem('user', JSON.stringify(user));
      
      this.fetchApiData.deleteFavoriteMovie(movie._id).subscribe(
        () => {
          console.log('Movie removed from favorites successfully.');
          this.snackbar.open('Movie removed from favorites!', 'OK', {
            duration: 2000,
          });
          this.updateUserFavorites(); // Update user favorites after removing a favorite movie
        },
        (error) => {
          console.error('Error removing movie from favorites:', error);
          this.snackbar.open('Error removing movie from favorites', 'OK', {
            duration: 2000,
          });
        }
      );
    } else {
      user.favoriteMovies.push(movie._id);
      localStorage.setItem('user', JSON.stringify(user));
      
      this.fetchApiData.addFavoriteMovie(movie._id).subscribe(
        () => {
          console.log('Movie added to favorites successfully.');
          this.snackbar.open('Movie added to favorites!', 'OK', {
            duration: 2000,
          });
          this.updateUserFavorites(); // Update user favorites after adding a favorite movie
        },
        (error) => {
          console.error('Error adding movie to favorites:', error);
          this.snackbar.open('Error adding movie to favorites', 'OK', {
            duration: 2000,
          });
        }
      );
    }
  }

  isMovieFavorite(movie: any): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.favoriteMovies && user.favoriteMovies.includes(movie._id);
  }

  updateUserFavorites(): void {
    this.fetchApiData.getUserFavorites().subscribe(
      (favorites: any) => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        user.favoriteMovies = favorites;
        localStorage.setItem('user', JSON.stringify(user));
      },
      (error) => {
        console.error('Error fetching updated favorite movies:', error);
        this.snackbar.open('Error fetching updated favorite movies', 'OK', {
          duration: 2000,
        });
      }
    );
  }
}
