class Router {
  constructor() {
    this.#init();
  }

  #paths = {};

  #init() {
    document.addEventListener(
      'click',
      (event) => {
        event.preventDefault();
      },
      false
    );

    window.addEventListener('DOMContentLoaded', (event) => {
      event.preventDefault();
    });

    window.addEventListener('popstate', () => {});
  }

  #parsePattern(pattern) {
    const step1 = pattern.replace(/\//g, '/');
    const step2 = step1.replace(/(*|:w*)/gm, '(:?[A-z0-9|*]*)');

    return `^${step2}(?:\/?)$`;
  }

  // registers path
  get(pattern, callback) {
    const patternExists = Object.keys(this.#paths).includes(pattern);

    if (!patternExists) {
      this.#paths[pattern] = {};
      this.#paths[pattern].callbacks = [];
    }

    this.#paths[pattern].reg = this.#parsePattern(pattern);
    this.#paths[pattern].callbacks.push(callback);
  }
}

export default Router;
