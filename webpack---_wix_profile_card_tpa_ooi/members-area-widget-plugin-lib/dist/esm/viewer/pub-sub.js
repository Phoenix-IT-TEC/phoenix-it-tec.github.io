import _defineProperty from "@babel/runtime/helpers/defineProperty";
export class PubSub {
  constructor() {
    _defineProperty(this, "listeners", []);
  }
  addListener(listener) {
    this.listeners.push(listener);
  }
  notifyListeners(value) {
    this.listeners.forEach(listener => listener(value));
  }
  purge() {
    this.listeners = [];
  }
}
//# sourceMappingURL=pub-sub.js.map