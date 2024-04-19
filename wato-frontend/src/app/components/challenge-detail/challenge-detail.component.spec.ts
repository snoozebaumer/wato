import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { ChallengeDetailComponent } from './challenge-detail.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ChallengeService } from '../../services/challenge.service';
import { UserService } from '../../services/user.service';
import { of } from 'rxjs';
import { ChallengeStatus } from '../../models/challenge-status';
import { FormsModule } from '@angular/forms';
import { Challenge } from '../../models/challenge';
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name: 'translate'})
export class TranslatePipeMock implements PipeTransform {
  transform(value: string): string {
    switch(value) {
      case "GAME.CHALLENGE_TITLE":
        return "Challenge Title";
      case "GAME.CHALLENGER":
        return "Challenger";
      case "GAME.CHALLENGER_PLACEHOLDER":
        return "Challenger Placeholder";
      case "GAME.CHALLENGE_BUTTON":
        return "Challenge Button";
      case "GAME.RANGE":
        return "Range";
      case "GAME.RANGE_PLACEHOLDER":
        return "Range Placeholder";
      case "GAME.NUMBER":
        return "Number";
      case "GAME.CONTINUE_BUTTON":
        return "Continue";
      case "GAME.ODDS":
        return "Odds";
      case "GAME.CHALLENGEE":
        return "Challengee";
    }
    return "";
  }
}

describe('ChallengeDetailComponent', () => {
  let component: ChallengeDetailComponent;
  let fixture: ComponentFixture<ChallengeDetailComponent>;
  let mockActivatedRoute;
  const mockRouter = jasmine.createSpyObj(['navigate']);
  const mockChallengeService = jasmine.createSpyObj<ChallengeService>('ChallengeService', ['getChallenge', 'setRange', 'setGuess']);
  const mockUserService = jasmine.createSpyObj('UserService', ['get']);

  beforeEach(() => {
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('123')
        }
      }
    };

    TestBed.configureTestingModule({
      declarations: [ChallengeDetailComponent, TranslatePipeMock],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: ChallengeService, useValue: mockChallengeService },
        { provide: UserService, useValue: mockUserService }
      ],
      imports: [FormsModule] // Add FormsModule for ngModel
    });

    fixture = TestBed.createComponent(ChallengeDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve challenge details on ngOnInit', fakeAsync(() => {
    const mockChallenge = new Challenge("123", "holsch es bier?", "123", "Peter");
    mockChallengeService.getChallenge.and.returnValue(of(mockChallenge));

    fixture.detectChanges();
    tick();

    expect(component.challenge).toEqual(mockChallenge);
  }));

  it('should navigate to /share/:id if user is not involved in the game and state is GUESS_TO_BE_SET', fakeAsync(() => {
    const mockChallenge =<Challenge>{
      id: '123',
      challenge: "hörsch uf Unit tests schriibe?",
      challengeStatus: ChallengeStatus.GUESS_TO_BE_SET,
      challengerId: '456',
      challengerName: "Heinz",
      challengeeId: '789'
    };
    mockUserService.user = { id: '999' };
    mockChallengeService.getChallenge.and.returnValue(of(mockChallenge));

    component.ngOnInit();
    tick();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/share', '123']);
  }));

  it('should navigate to /share/:id if user is not challenger and state is NEW', fakeAsync(() => {
    const mockChallenge =<Challenge>{
      id: '123',
      challenge: "hörsch uf Unit tests schriibe?",
      challengeStatus: ChallengeStatus.NEW,
      challengerId: '456',
      challengerName: "Heinz",
    };
    mockUserService.user = { id: '456' };
    mockChallengeService.getChallenge.and.returnValue(of(mockChallenge));

    component.ngOnInit();
    tick();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/share', '123']);
  }));

  it('should set challengee guess and navigate to /share/:id on setChallengeeGuess()', fakeAsync(() => {
    const mockChallenge =<Challenge> {
      id: '123',
      challenge: "hörsch uf Unit tests schriibe?",
      challengerId: '456',
      challengeStatus: ChallengeStatus.GUESS_TO_BE_SET,
      maxRange: 10,
      challengerName: 'test',
      challengeeName: 'Heiri',
      challengeeNumber: 7
    };

    mockChallengeService.getChallenge.and.returnValue(of(mockChallenge));
    mockChallengeService.setGuess.and.returnValue(of(mockChallenge));

    fixture.detectChanges();
    component.setChallengeeGuess();
    tick();


    expect(mockChallengeService.setGuess).toHaveBeenCalledWith('123', 7, undefined);
    expect(component.formError).toBeUndefined();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/share', '123']);
  }));


  it('should finish game when challenger guess is set', fakeAsync(() => {
    const mockChallenge =<Challenge> {
      id: '123',
      challenge: "hörsch uf Unit tests schriibe?",
      challengerId: '456',
      challengeStatus: ChallengeStatus.CHALLENGER_TO_MOVE,
      maxRange: 10,
      challengerName: 'test',
      challengeeName: 'Heiri',
      challengeeNumber: 7,
      challengerNumber: 7
    };

    mockChallengeService.getChallenge.and.returnValue(of(mockChallenge));
    const returnChallenge = <Challenge>{...mockChallenge};
    returnChallenge.challengeStatus = ChallengeStatus.SUCCESS;
    mockChallengeService.setGuess.and.returnValue(of(returnChallenge));

    fixture.detectChanges();
    component.setChallengerGuess();
    tick();

    expect(mockChallengeService.setGuess).toHaveBeenCalledWith('123', undefined, 7);
    expect(component.formError).toBeUndefined();
    expect(component.challenge).toEqual(returnChallenge);
  }));

});
