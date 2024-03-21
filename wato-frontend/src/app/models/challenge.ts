import {ChallengeStatus} from './challenge-status';

export class Challenge {
  id: string;
  challenge: string;
  challengerId: string;
  challengerName: string;
  challengeeId?: string;
  challengeeName?: string;
  challengeStatus: ChallengeStatus = ChallengeStatus.NEW;
  maxRange?: number = undefined;
  challengerNumber?: number = undefined;
  challengeeNumber?: number = undefined;

  constructor(id: string, challenge: string, challengerId: string, challengerName: string) {
    this.id = id;
    this.challenge = challenge;
    this.challengerId = challengerId;
    this.challengerName = challengerName;
  }
}

