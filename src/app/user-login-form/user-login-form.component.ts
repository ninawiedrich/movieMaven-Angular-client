import { Component, OnInit, Input } from '@angular/core';

// This import will be used to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// This import brings in the API calls we created in the fetch-api-data.service.ts file
import { FetchApiDataService } from '../fetch-api-data.service';

// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss']
})
export class UserLoginFormComponent implements OnInit {

  @Input() loginData = { username: '', password: '' };

constructor	(
  public fetchApiData: FetchApiDataService,
  public dialogRef: MatDialogRef<UserLoginFormComponent>,
  public snackBar: MatSnackBar) { }

ngOnInit(): void {
}

loginUser(): void {
  this.fetchApiData.userLogin(this.loginData).subscribe((result) => {
    // Logic for a successful user login goes here! (To be implemented)
    localStorage.setItem('user', JSON.stringify(result.user));//result.user.Username   --instead JSON.stringify?
    localStorage.setItem('token', result.token);
    
    this.dialogRef.close(); // This will close the modal on success!
    this.snackBar.open('Logged in', 'OK', {
      duration: 2000
    });
  }, (result) => {
    this.snackBar.open(result, 'OK', {
      duration: 2000
    });
  });
}

}


