class Router {
  constructor() {
    this.#init();
  }

  #paths = {};

  #previousPath = null;

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
      this.#checkPatterns(window.location.pathname);
    });

    window.addEventListener('popstate', () => {
      this.#checkPatterns(window.location.pathname);
    });
  }

  #parsePattern(pattern) {
    const step1 = pattern.replace(/\\/g, '\\/');
    const step2 = step1.replace(/(\:\w*)/gm, '(:?[A-z0-9]*)');

    return `^${step2}(?:\/?)$`;
  }

  #checkIfAnyPatternIsMatching(url) {
    return (element) => {
      const pattern = this.#paths[element].reg;
      const newRegex = new RegExp(pattern, 'i').exec(url);

      if (!newRegex) {
        return false;
      }

      return true;
    };
  }

  #transformRegexOutput(input) {
    try {
      return Object.keys(input)
        .filter((key) => Number(key))
        .reduce((obj, key) => {
          return { ...obj, [key]: input[key] };
        }, {});
    } catch (error) {
      // Return 404 page
      return {};
    }
  }

  #mergeObjects(tokens, params) {
    const parameters = {};
    Object.values(tokens).forEach((token, index) => {
      const parsedToken = token.replace(':', '');

      parameters[parsedToken] = params[index + 1];
    });

    return { parameters };
  }

  #getParams(pattern, url) {
    const parsedPattern = this.#paths[pattern].reg;
    const regex = new RegExp(parsedPattern, 'i');

    const tokens = this.#transformRegexOutput(regex.exec(pattern));
    const params = this.#transformRegexOutput(regex.exec(url));

    return this.#mergeObjects(tokens, params);
  }

  #processURL(pattern, url) {
    this.#previousPath = url;
    const result = this.#getParams(pattern, url);

    return this.#paths[pattern].callbacks.forEach((callback) =>
      callback(result)
    );
  }

  #checkPatterns(url) {
    const targetUrl = url;

    // Find the matching pattern
    const result = Object.keys(this.#paths).find(
      this.#checkIfAnyPatternIsMatching(targetUrl)
    );

    // If pattern is not found we return an error or 404
    if (!result) {
      // Return 404 page
      return false;
    }

    // Prevent reloading the page if the url is the same
    if (this.#previousPath === targetUrl) {
      return false;
    }

    // Run the callback function
    this.#processURL(result, targetUrl);

    return true;
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
