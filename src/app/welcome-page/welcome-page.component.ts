import { Component, OnInit } from '@angular/core';
import { UserLoginFormComponent } from '../user-login-form/user-login-form.component';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';
import { MatDialog } from '@angular/material/dialog';

/**
 * Component representing the welcome page.
 * Provides options for user registration and login.
 * 
 * @component
 */
@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss'],
})
export class WelcomePageComponent implements OnInit {
  
   /**
   * Constructor for the WelcomePageComponent.
   * 
   * @param dialog Service to open Material Design modal dialogs.
   */
  constructor(public dialog: MatDialog) {}
  
  /**
   * Lifecycle hook that is called after data-bound properties are initialized.
   */
  ngOnInit(): void {}

  /**
   * Open the user registration dialog.
   */
  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, {
      width: '280px',
    });
  }

  /**
   * Open the user login dialog.
   */
  openUserLoginDialog(): void {
    this.dialog.open(UserLoginFormComponent, {
      width: '280px',
    });
  }
}
