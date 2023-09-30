import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';


//Declaring the api url that will provide data for the client app
const apiUrl = 'https://moviemaven-dfc40ecb1c33.herokuapp.com/';

// Defining the service
@Injectable({
  // This service is provided in the root level, so it's available throughout the app
  providedIn: 'root'
})
export class FetchApiDataService {

  //Constructor to inject the HttpClient service, which is used to make HTTP requests
  constructor(private http: HttpClient) {}

  // Method to register a new user account, it takes the following parameters:
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    // Making a POST request to the 'users' endpoint of the API with user registration endpoint
    // and handling errors if any occur
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  // Method to get all movies
  getAllMovies(): Observable<any> {
    // Retrieving the token from local storage
    const token = localStorage.getItem('token');
    // Making a GET request to the 'movies' endpoint of the API with the Authorization header
    // and handling errors if any occur
    return this.http.get(apiUrl + 'movies', {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })}).pipe(
      // Mapping the response data
      map(this.extractResponseData),
      // Handling errors
      catchError(this.handleError)
    );
  }

    // Making the api call for the get one movie endpoint
    getOneMovie(title: string): Observable<any> {
      const token = localStorage.getItem('token');
      return this.http.get(apiUrl + 'movies/' + title, {
        headers: new HttpHeaders(
          {
            Authorization: 'Bearer ' + token,
          })
      }).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
    }

     // Making the api call for the get one director endpoint
  getOneDirector(DirectorName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/director/' + DirectorName, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Making the api call for the get one genre endpoint
  getOneGenre(GenreName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/genre/' + GenreName, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }






      // Making the api call for the get one user endpoint
      getOneUser(): Observable < any > {
        const username = localStorage.getItem('username');
        const token = localStorage.getItem('token');
        return this.http.get(apiUrl + 'users/' + username, {
            headers: new HttpHeaders(
                {
                    Authorization: 'Bearer ' + token
                }
            )
        }).pipe(map(this.extractResponseData), catchError(this.handleError));
    }

    // Making the api call for the get favourite movies for a user endpoint
    getFavoriteMovies(): Observable < any > {
      const username = localStorage.getItem('username');
      const token = localStorage.getItem('token');
      return this.http.get(apiUrl + 'users/' + username, {
          headers: new HttpHeaders(
              {
                  Authorization: 'Bearer ' + token
              }
          )
      }).pipe(map(this.extractResponseData), map((data) => data.FavoriteMovies), catchError(this.handleError));
  }

  // Making the api call for the add a movie to favourite Movies endpoint
  addFavoriteMovie(movieId : string): Observable < any > {
      const username = localStorage.getItem('username');
      const token = localStorage.getItem('token');
      return this.http.post(apiUrl + 'users/' + username + '/movies/' + movieId, {
          headers: new HttpHeaders(
              {
                  Authorization: 'Bearer ' + token
              }
          )
      }).pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Making the api call for the edit user endpoint
  editUser(updatedUser : any): Observable < any > {
      const username = localStorage.getItem('username');
      const token = localStorage.getItem('token');
      return this.http.put(apiUrl + 'users/' + username, updatedUser, {
          headers: new HttpHeaders(
              {
                  Authorization: 'Bearer ' + token
              }
          )
      }).pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Making the api call for the delete user endpoint
  deleteUser(): Observable < any > {
      const username = localStorage.getItem('username');
      const token = localStorage.getItem('token');
      return this.http.delete(apiUrl + 'users/' + username, {
          headers: new HttpHeaders(
              {
                  Authorization: 'Bearer ' + token
              }
          )
      }).pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Making the api call for deleting a movie from the favorite movies endpoint
  deleteFavoriteMovie(movieId : string): Observable < any > {
      const username = localStorage.getItem('username');
      const token = localStorage.getItem('token');
      return this.http.delete(apiUrl + 'users/' + username + '/movies/' + movieId, {
          headers: new HttpHeaders(
              {
                  Authorization: 'Bearer ' + token
              }
          )
      }).pipe(map(this.extractResponseData), catchError(this.handleError));
  }



  // Method to handle errors during HTTP requests
  private handleError(error: HttpErrorResponse): any {
    // Checking if the error is a client-side or network error
    if (error.error instanceof ErrorEvent) {
      // Logging the error message to the console
      console.error('Some error occurred:', error.error.message);
    } else {
      // Logging the status code and error body if the error is a server-side error
      console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`);
    }
    // Throwing an error message
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  // Method to extract data from the response
  private extractResponseData(res: any): any {
     // Non-typed response extraction
    // Storing the response in the body constant
    const body = res;
    // Returning the body or an empty object if the body is undefined
    return body || { };
  }
}

