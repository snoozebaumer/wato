import {UserService} from './services/user.service';

export function initializeAppFactory(
  userService: UserService
): () => void {
  return () => userService.loadUser();
}
