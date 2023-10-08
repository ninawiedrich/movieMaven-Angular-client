import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

const apiUrl = 'https://moviemaven-dfc40ecb1c33.herokuapp.com/';

/**
 * Service to fetch data from the API.
 * 
 * @class
 */
@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  
  /**
   * @constructor
   * @param {HttpClient} http - The injected HttpClient.
   */
  constructor(private http: HttpClient) {}

  /**
   * Register a new user.
   * 
   * @param userDetails - The user details for registration.
   * @returns An Observable of the registration response.
   */
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(apiUrl + 'users', userDetails)
      .pipe(catchError(this.handleError));
  }

  /**
   * Log in a user.
   * 
   * @param userDetails - The user details for login.
   * @returns An Observable of the login response.
   */
  public userLogin(userDetails: any): Observable<any> {
    return this.http
      .post(apiUrl + 'login', userDetails)
      .pipe(catchError(this.handleError));
  }

  /**
   * Fetch all movies.
   * @returns An observable with the list of all movies.
   */
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Fetch a specific movie by its title.
   * @param title - The title of the movie.
   * @returns An observable with the movie details.
   */
  getOneMovie(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/' + title, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Fetch details of a specific director by name.
   * @param DirectorName - The name of the director.
   * @returns An observable with the director details.
   */
  getOneDirector(DirectorName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/director/' + DirectorName, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Fetch details of a specific genre by name.
   * @param GenreName - The name of the genre.
   * @returns An observable with the genre details.
   */
  getOneGenre(GenreName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/genre/' + GenreName, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Fetch details of a specific user.
   * @returns An observable with the user details.
   */
  getOneUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'users/' + user.username, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Fetch the favorite movies of a user.
   * @returns An observable with the list of favorite movies.
   */
  getFavoriteMovies(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'users/' + user.username, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(
        map(this.extractResponseData),
        map((data) => data.favoriteMovies),
        catchError(this.handleError)
      );
  }

  /**
   * Add a movie to a user's list of favorite movies.
   * @param movieId - The ID of the movie to be added.
   * @returns An observable with the result of the operation.
   */
  addFavoriteMovie(movieId: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    // Make the API call to the backend server to add the movie to favorites
    return this.http
      .post(
        apiUrl + 'users/' + user.username + '/movies/' + movieId,
        {},
        {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
          }),
          responseType: 'text', // Change the responseType to 'text' since the server returns a text response
        }
      )
      .pipe(catchError(this.handleError));
  }

  /**
   * Check if a movie is in a user's list of favorite movies.
   * @param movieId - The ID of the movie to be checked.
   * @returns A boolean indicating if the movie is a favorite.
   */
  isFavoriteMovie(movieId: string): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.favoriteMovies.indexOf(movieId) >= 0;
  }

  /**
   * Update a user's details.
   * @param updatedUser - The updated details of the user.
   * @returns An observable with the result of the operation.
   */
  editUser(updatedUser: any): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http
      .put(apiUrl + 'users/' + user.username, updatedUser, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Delete a user's account.
   * @returns An observable with the result of the operation.
   */
  deleteUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http
      .delete(apiUrl + 'users/' + user._id, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Remove a movie from a user's list of favorite movies.
   * @param movieId - The ID of the movie to be removed.
   * @returns An observable with the result of the operation.
   */
  deleteFavoriteMovie(movieId: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    const index = user.favoriteMovies.indexOf(movieId);
    console.log(index);
    if (index > -1) {
      // only splice array when item is found
      user.favoriteMovies.splice(index, 1);
    }
    localStorage.setItem('user', JSON.stringify(user));
    return this.http
      .delete(apiUrl + 'users/' + user.username + '/movies/' + movieId, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
        responseType: 'text',
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Extract data from the response.
   * @param res - The response object.
   * @returns The body of the response.
   */
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  /**
   * Handle HTTP errors.
   * 
   * @private
   * @param error - The error response.
   * @returns A thrown error observable.
   */
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
