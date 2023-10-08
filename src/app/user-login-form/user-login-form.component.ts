import { Component, OnInit, Input } from '@angular/core';

// This import will be used to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// This import brings in the API calls we created in the fetch-api-data.service.ts file
import { FetchApiDataService } from '../fetch-api-data.service';

// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';

// This import is used to enable navigation from one component to another
import { Router } from '@angular/router';

/**
 * Component that provides a user login form.
 * 
 * @component
 */
@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss'],
})
export class UserLoginFormComponent implements OnInit {
  
  /**
   * Input data for the login form.
   */
  @Input() loginData = { username: '', password: '' };

  /**
   * Constructor for the UserLoginFormComponent.
   * 
   * @param fetchApiData Service to handle the API calls.
   * @param dialogRef Reference to the dialog opened.
   * @param snackBar For showing notifications to the user.
   * @param router For navigating to different routes.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  /**
   * Lifecycle hook that is called after data-bound properties are initialized.
   */
  ngOnInit(): void {}

  /**
   * Send the user login form data to the backend and handle the response.
   */
  loginUser(): void {
    this.fetchApiData.userLogin(this.loginData).subscribe(
      (result) => {
        console.log('Login Response:', result);
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('token', result.token);

        this.dialogRef.close(); // This will close the modal on success!
        this.snackBar.open('Logged in', 'OK', {
          duration: 2000,
        });

        // Navigate to the 'movies' route after successful login
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
