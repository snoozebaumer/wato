import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Challenge} from '../../models/challenge';
import {ChallengeService} from '../../services/challenge.service';
import {ChallengeStatus} from '../../models/challenge-status';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-challenge-detail',
  templateUrl: './challenge-detail.component.html',
  styleUrl: './challenge-detail.component.css'
})
export class ChallengeDetailComponent {
  challenge: Challenge = new Challenge('', '', '', '');
  formError?: string;

  constructor(
    public route: ActivatedRoute,
    private challengeService: ChallengeService,
    private router: Router,
    public userService: UserService) {
  }

  ngOnInit(): void {
    this.getChallenge();
  }

  getChallenge(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.challengeService.getChallenge(id).subscribe((challenge: Challenge) => {
      this.challenge = challenge;

      if (this.checkAccessNotAllowed()) {
        this.router.navigate(['/share', this.challenge.id]);
      }

      if (this.challenge.challengeStatus === ChallengeStatus.NEW && this.userService.user) {
        this.challenge.challengeeName = this.userService.user.name;
      }
    })
  }

  protected readonly ChallengeService = ChallengeService;
  protected readonly ChallengeStatus = ChallengeStatus;

  protected readonly window = window;

  setRange() {
    if (!this.challenge?.maxRange || this.challenge.maxRange < 0 || !this.challenge.challengeeName) {
      this.formError = 'GAME.ERROR_REQUIRED_INPUTS';
      return;
    }
    return this.challengeService.setRange(this.challenge.id, this.challenge.maxRange, this.challenge.challengeeName).subscribe((response) => {
      this.formError = undefined;
      this.challenge.challengeStatus = response.challengeStatus;
    });
  }

  setChallengeeGuess() {
    this.setGuess(this.challenge.challengeeNumber, true)?.subscribe(async (response) => {
      this.formError = undefined;
      await this.router.navigate(['/share', this.challenge.id]);
    });
  }

  setChallengerGuess() {
    this.setGuess(this.challenge.challengerNumber)?.subscribe(async (response) => {
      this.formError = undefined;
      this.challenge = response;
    });
  }

  setGuess(chosenNumber?: number, challengee = false) {
    if (!chosenNumber || chosenNumber > this.challenge.maxRange!
      || chosenNumber < 1) {
      this.formError = "GAME.ERROR_RESPECT_RANGE";
      return;
    }
    return this.challengeService.setGuess(this.challenge.id,
      challengee ? chosenNumber: undefined, challengee ? undefined : chosenNumber);
  }

  checkAccessNotAllowed(): boolean {
    const user = this.userService.user;

    // if user is not involved in game
    if (!user || (user.id !== this.challenge.challengeeId && user.id !== this.challenge.challengerId)) {
      return this.challenge.challengeStatus === ChallengeStatus.GUESS_TO_BE_SET ||
        this.challenge.challengeStatus === ChallengeStatus.CHALLENGER_TO_MOVE;
    }
    const userId = user.id;

    // if user is challengee
    if (userId === this.challenge.challengeeId) {
      return this.challenge.challengeStatus === ChallengeStatus.CHALLENGER_TO_MOVE;
    }

    // if user is challenger
    if (userId === this.challenge.challengerId) {
      return this.challenge.challengeStatus === ChallengeStatus.NEW ||
        this.challenge.challengeStatus === ChallengeStatus.GUESS_TO_BE_SET;
    }

    return false;
  }
}
