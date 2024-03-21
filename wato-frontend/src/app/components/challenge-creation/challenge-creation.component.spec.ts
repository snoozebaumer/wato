import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { ChallengeCreationComponent } from './challenge-creation.component';
import {Pipe, PipeTransform} from "@angular/core";
import {ChallengeService} from "../../services/challenge.service";
import {of} from "rxjs";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";

@Pipe({name: 'translate'})
export class TranslatePipeMock implements PipeTransform {
  transform(value: string): string {
    switch(value) {
      case "GAME.CHALLENGE_TITLE":
        return "Challenge Title";
      case "GAME.CHALLENGE_PLACEHOLDER":
        return "Challenge Placeholder";
      case "GAME.CHALLENGER":
        return "Challenger";
      case "GAME.CHALLENGER_PLACEHOLDER":
        return "Challenger Placeholder";
      case "GAME.CHALLENGE_BUTTON":
        return "Challenge Button";
    }
    return "";
  }
}

describe('CreateChallengeComponent', () => {
  let component: ChallengeCreationComponent;
  let fixture: ComponentFixture<ChallengeCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChallengeCreationComponent, TranslatePipeMock],
      providers: [{
        provide: ChallengeService,
        useValue: {
          createChallenge: () => {
            return {
              subscribe: () => {of({id: "123"})}
            }
          }
        }
      },
        {
          provide: UserService,
          useValue: {
            user: {
              id: "123",
              name: "test"
            }
          }
        }
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChallengeCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display translated challenge title label', () => {
    const fixture = TestBed.createComponent(ChallengeCreationComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('label')?.textContent).toEqual('Challenge Title');
  });

  it('should display translated challenge placeholder text', () => {
    const fixture = TestBed.createComponent(ChallengeCreationComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#challenge')?.getAttribute('placeholder')).toEqual('Challenge Placeholder');
  });

  it('should display translated challenger label', () => {
    const fixture = TestBed.createComponent(ChallengeCreationComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('label')[1]?.textContent).toEqual('Challenger');
  });

  it('should display translated challenger placeholder text', () => {
    const fixture = TestBed.createComponent(ChallengeCreationComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#name')?.getAttribute('placeholder')).toEqual('Challenger Placeholder');
  });

  it('should display translated challenge button text', () => {
    const fixture = TestBed.createComponent(ChallengeCreationComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('button')?.textContent).toEqual('Challenge Button');
  });

  it('should create challenge with correct inputs and navigate to share route', async () => {
    const challengeService = TestBed.inject(ChallengeService);
    const routerSpy = spyOn(TestBed.inject(Router), 'navigate').and.returnValue(Promise.resolve(true));

    const fixture = TestBed.createComponent(ChallengeCreationComponent);
    const component = fixture.componentInstance;
    const createChallengeSpy = spyOn(challengeService, 'createChallenge').and.returnValue(of({ id: '123' }));

    fixture.detectChanges();

    component.create('chaufsch BIER?', 'Hans');

    expect(createChallengeSpy).toHaveBeenCalledWith('chaufsch BIER?', 'Hans');

    await fixture.whenStable();
    expect(routerSpy).toHaveBeenCalledWith(['/share', '123']);
  });

  it('should set challenger input if userService.user is present', fakeAsync(() => {
    const userService = TestBed.inject(UserService);
    userService["_user"] = { id: "123", name: 'test' };

    const fixture = TestBed.createComponent(ChallengeCreationComponent);
    fixture.detectChanges();
    tick();

    const element = fixture.nativeElement as HTMLElement;
    const challengerInput = element.querySelector('#name');

    // @ts-ignore
    expect(challengerInput["value"]).toEqual('test');
  }));

  it('should not disable challenger input if userService.user is not present', () => {
    const userService = TestBed.inject(UserService);
    userService["_user"] = undefined;

    const fixture = TestBed.createComponent(ChallengeCreationComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const challengerInput = element.querySelector('#name');

    expect(challengerInput?.getAttribute('disabled')).toBeFalsy();
  });


});
