import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ChallengeCreationComponent} from './components/challenge-creation/challenge-creation.component';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {ChallengeDetailComponent} from './components/challenge-detail/challenge-detail.component';
import {ShareComponent} from './components/share/share.component';
import {ClipboardModule} from "@angular/cdk/clipboard";
import {UserService} from './services/user.service';
import {initializeAppFactory} from './app.initializer';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    ChallengeCreationComponent,
    ChallengeDetailComponent,
    ShareComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    FormsModule,
    ClipboardModule
  ],
  providers: [{
    provide: APP_INITIALIZER,
    useFactory: initializeAppFactory,
    deps: [UserService],
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
