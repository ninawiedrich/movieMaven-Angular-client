import { NgModule } from '@angular/core';

// Import HttpClientModule from @angular/common/http (simplified API for Angular applications that makes it possible for the client app to communicate with the API or server-side)
import { HttpClientModule } from '@angular/common/http';


import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule, // Add HttpClientModule to the imports array
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
