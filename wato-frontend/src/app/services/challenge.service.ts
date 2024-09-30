import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Challenge} from '../models/challenge';
import {Observable} from 'rxjs';
import {ChallengeStatus} from '../models/challenge-status';

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {
  constructor(private readonly httpClient: HttpClient) {
  }

  createChallenge(challenge: string, challenger: string) {
    return this.httpClient.post<{ id: string }>('http://127.0.0.1:8080/api/challenges', {
      challenge,
      'name': challenger,
      'challengeStatus': ChallengeStatus.NEW
    }, {withCredentials: true});
  }

  getChallenge(id: string): Observable<Challenge> {
    return this.httpClient.get<Challenge>(`http://127.0.0.1:8080/api/challenges/${id}`, {withCredentials: true});
  }

  setRange(id: string, range: number, challengeeName: string): Observable<Challenge> {
    return this.httpClient.patch<Challenge>(`http://127.0.0.1:8080/api/challenges/${id}`, {'maxRange': range, challengeeName}, {withCredentials: true});
  }

  setGuess(id: string, challengeeNumber?: number, challengerNumber?: number): Observable<Challenge> {
    const params  = {...(challengeeNumber ? {challengeeNumber} : {}), ...(challengerNumber ? {challengerNumber} : {})}
    return this.httpClient.patch<Challenge>(`http://127.0.0.1:8080/api/challenges/${id}`, params, {withCredentials: true});
  }

}
