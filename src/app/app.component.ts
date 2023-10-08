import { Component } from '@angular/core';
import { UserRegistrationFormComponent } from './user-registration-form/user-registration-form.component';
import { UserLoginFormComponent } from './user-login-form/user-login-form.component';
import { MovieCardComponent } from './movie-card/movie-card.component';
import { MatDialog } from '@angular/material/dialog';

/**
 * Root component of the application.
 * 
 * @component
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  
  /**
   * Title of the application.
   */
  title = 'myFlix-Angular-client';

  /**
   * Constructor to initialize the AppComponent.
   * 
   * @param dialog Service to open Material Design modal dialogs.
   */
  constructor(public dialog: MatDialog) { }


  /**
   * Opens the movies dialog.
   */
  openMoviesDialog(): void {
    this.dialog.open(MovieCardComponent, {
      width: '500px'
    });
  }
  }