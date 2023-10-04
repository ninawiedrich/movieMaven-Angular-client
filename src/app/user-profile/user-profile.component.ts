import { Component, OnInit, Input } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  user: any = {};
  favoriteMovies: any[] = [];
  @Input() userData = { username: '', password: '', email: '', birthday: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    private router: Router,
  ) { }

  ngOnInit(): void {
this.getUser();
  }

  getUser(): void {
    this.fetchApiData.getOneUser().subscribe((response: any) => {
      this.user = response;
      this.userData.username = this.user.username;
      this.userData.email = this.user.email;
      if (this.user.birthday) {
        console.log('User Birthday:', this.user.birthday);
        this.userData.birthday = formatDate(this.user.birthday, 'yyyy-MM-dd', 'en-US', 'UTC+0');
      }
  
      this.fetchApiData.getAllMovies().subscribe((response: any) => {
        if (this.user.favoriteMovies && Array.isArray(this.user.favoriteMovies)) {
          this.favoriteMovies = response.filter((m: { _id: any }) => this.user.favoriteMovies.indexOf(m._id) >= 0);
        } else {
          this.favoriteMovies = [];
        }
      });
    }, (error) => {
      console.error('Error fetching user data', error);
    });
  }
  

  editUser(): void {
    this.fetchApiData.editUser(this.userData).subscribe((data) => {
      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('username', data.username);
      this.snackBar.open('User has been updated', 'OK', {
        duration: 2000
      })
      window.location.reload();
    }, (result) => {
      this.snackBar.open(result, 'OK', {
        duration: 2000
      })
    });
  }

  deleteUser(): void {
    if (confirm('are you sure?')) {
      this.router.navigate(['welcome']).then(() => {
        this.snackBar.open(
          'You have successfully deleted your account',
          'OK',
          {
            duration: 2000,
          }
        );
      });
      this.fetchApiData.deleteUser().subscribe((result) => {
        localStorage.clear();
      });
    }
  }
}