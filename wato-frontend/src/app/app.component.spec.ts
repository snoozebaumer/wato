import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {ChallengeCreationComponent} from "./components/challenge-creation/challenge-creation.component";
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name: 'translate'})
class TranslatePipeMock implements PipeTransform {
  transform(value: string): string {
    return "What are the odds?";
  }
}

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{
        provide: TranslateService,
        useValue: {
          setDefaultLang: () => {},
          use: () => {},
        }
      }
      ],
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot()
      ],
      declarations: [
        AppComponent,
        ChallengeCreationComponent,
        TranslatePipeMock
      ],
    }).compileComponents();
  });

  it('should render translated and capitalized title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('WHAT ARE THE ODDS?');
  });
});
