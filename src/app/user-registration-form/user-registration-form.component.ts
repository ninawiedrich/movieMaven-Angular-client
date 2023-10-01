import { Component, OnInit, Input } from '@angular/core';

// This import will be used to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// This import brings in the API calls we created in the fetch-api-data.service.ts file
import { FetchApiDataService } from '../fetch-api-data.service';

// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss']
})
export class UserRegistrationFormComponent implements OnInit{

  @Input() userData = { username: '', password: '', email: '', birthday: '' };

constructor	(
  public fetchApiData: FetchApiDataService,
  public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
  public snackBar: MatSnackBar) { }

ngOnInit(): void {
}

// This is the function responsible for sending the form inputs to the backend
/**
 * Function responsible for sending the form inputs to the backend to create a new user account
 * @returns alert saying whether the registration was successful or not
 */
registerUser(): void {
  this.fetchApiData.userRegistration(this.userData).subscribe((result) => {
    // Logic for a successful user registration goes here! (To be implemented)
    this.dialogRef.close(); // This will close the modal on success!
    console.log(result);
    this.snackBar.open( result, 'OK', {
      duration: 2000
    });
  }, (result) => {
    console.log(result);
    this.snackBar.open(result, 'OK', {
      duration: 2000
    });
  });
}

}
