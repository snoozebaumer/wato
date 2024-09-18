import {Component} from '@angular/core';
import {ChallengeService} from "../../services/challenge.service";
import {Router} from "@angular/router";
import {UserService} from '../../services/user.service';
@Component({
  selector: 'create-challenge',
  templateUrl: './challenge-creation.component.html'
})
export class ChallengeCreationComponent {
  formError?: string;

  constructor(private router: Router, private challengeService: ChallengeService, public userService: UserService) {
  }

  create(challenge: string, challenger: string) {
    if (!challenge || !challenger) {
      this.formError = 'GAME.ERROR_REQUIRED_INPUTS';
      return;
    }
    this.challengeService.createChallenge(challenge, challenger).subscribe(async (response) => {
      await this.router.navigate(['/share', response.id]);
    });
  }
}
