import { ProfileChangeCallback, ProfileChangePayload } from '../types';

export class ProfileSubject {
  private observers: ProfileChangeCallback[] = [];

  registerObserver(callback: ProfileChangeCallback) {
    this.observers.push(callback);
  }

  unregisterObservers() {
    this.observers = [];
  }

  notifyObservers(payload: ProfileChangePayload) {
    this.observers.forEach((observer) => observer(payload));
  }
}
