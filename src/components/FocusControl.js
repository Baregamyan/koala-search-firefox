import {KeyCode} from '../const';

/**
 * @class
 */
export default class FocusControl {
  /**
   * @param {HTMLElement} resultsContainer - Class name of results container.
   * @param {HTMLElement} searchForm - Search form.
   * @param {string} resultClass - Class name of result container.
   */
  constructor(resultsContainer, searchForm, resultClass) {
    this._resultsContainer = resultsContainer;
    this._searchForm = searchForm;
    this._resultClass = `.${resultClass}`;
    this._results = this._resultsContainer.querySelectorAll(this._resultClass);
    this._linkListeners = [];
    this._documentListeners = [];

    this._onLinkBlur = this._blur.bind(this);
    this._onLinkFocus = this._focus.bind(this);
    this._onDocumentKeydown = this._keydown.bind(this);
    this._onDocumentKeyup = this._keyup.bind(this);

    this._indexActiveLink = 0;

    this._isAnyLinkFocused = false;

    this._isShiftPressed;
  }

  /**
   * Search form focus flag.
   */
  get _isSearchFormFocused() {
    return document.activeElement === this._searchForm;
  }

  /**
   * Create event listener callback.
   * @param {string} eventName - Event name.
   * @param {Object} callback - Function.
   * @return {Object}
   */
  _createListener(eventName, callback) {
    return {
      eventName: eventName,
      callback: callback,
    };
  }

  /**
   * Add to links needed classes and event listeners.
   */
  _initLinks() {
    this._links = Array.from(this._results)
        .map((result) => this._setLink(result.querySelector('a')))
        .filter((link, index, array) => array.indexOf(link) === index);
  }

  /**
   * Fill listeners.
   */
  _fillListeners() {
    this._documentListeners.push(
        this._createListener('keydown', this._onDocumentKeydown)
    );
    this._documentListeners.push(
        this._createListener('keyup', this._onDocumentKeyup)
    );

    this._linkListeners.push(
        this._createListener('blur', this._onLinkBlur)
    );
  }

  /**
   * @param {HTMLElement} element - Element for event listener.
   * @param {Array} listeners - Event listeners for element.
   */
  _setListeners(element, listeners) {
    listeners.forEach((listener) => {
      const {eventName, callback} = listener;
      element.addEventListener(eventName, callback);
    });
  }

  /**
   * Blur link event.
   */
  _blur() {
    this._isAnyLinkFocused = false;
    this._activeElement.classList.toggle('active', false);
    this._activeElement = null;
  }

  /**
   * Focus link event.
   * @param {HTMLElement} link - HTML element on link.
   */
  _focus(link) {
    link.focus();
    link.scrollIntoView({block: 'center'});
    this._activeElement = link.parentElement.parentElement;
    this._activeElement.classList.toggle('active', true);
  }

  /**
   * @param {HTMLElement} link - HTML link element.
   * @return {HTMLElement} - Ready link.
   */
  _setLink(link) {
    this._linkListeners.forEach((listener) => {
      const {eventName, callback} = listener;
      link.addEventListener(eventName, callback);
      link.classList.toggle('link', true);
    });
    return link;
  }

  /**
   * Keydown on keyboard.
   * @param {Object} evt - Event
   */
  _keydown(evt) {
    if (!this._isSearchFormFocused) {
      if (evt.keyCode === KeyCode.UP) {
        evt.preventDefault();
        this._up();
      }

      if (evt.keyCode === KeyCode.RIGHT) {
        if (this._indexActiveLink === (this._links.length - 1)) {
          evt.preventDefault();
        }
      }

      if (evt.keyCode === KeyCode.DOWN) {
        evt.preventDefault();
        this._down();
      }

      if (evt.keyCode === KeyCode.TAB) {
        evt.preventDefault();
        if (this._isShiftPressed) {
          this._up();
        } else {
          this._down();
        }
      }

      if (evt.keyCode === KeyCode.SHIFT) {
        this._isShiftPressed = true;
      }
    }
  }

  /**
   * Keyup on keyboard.
   * @param {Object} evt - Event.
   */
  _keyup(evt) {
    if (evt.keyCode === KeyCode.SHIFT) {
      this._isShiftPressed = false;
    }
  }

  /**
   * Init focus control.
   */
  init() {
    this._fillListeners();
    this._initLinks();

    this._setListeners(document, this._documentListeners);
    this._focus(this._links[0]);
  }

  /**
   * Focus goes up.
   */
  _up() {
    if (!(this._indexActiveLink === 0)) {
      this._indexActiveLink -= 1;
    } else {
      this._indexActiveLink = 0;
    }
    this._focus(this._links[this._indexActiveLink]);
  }

  /**
   * Focus goes down.
   */
  _down() {
    if (!(this._indexActiveLink === this._links.length - 1)) {
      this._indexActiveLink += 1;
    } else {
      this._indexActiveLink = this._links.length - 1;
    }
    this._focus(this._links[this._indexActiveLink]);
  }
}
