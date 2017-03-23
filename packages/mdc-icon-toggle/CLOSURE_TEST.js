import {MDCIconToggle} from './index.js';

(function() {
  /**
  * @param {boolean} cond
  * @param {string=} message
  */
  function assert(cond, message = '') {
    if (!cond) {
      let errMsg = 'Assertion Failed';
      if (message) {
        errMsg += `: ${message}`;
      }
      throw new Error(errMsg);
    }
    let successMsg = 'Assertion Passed';
    if (message) {
      successMsg += `: ${message}`;
    }
    console.info(successMsg);
  }

  const root = document.querySelector('.mdc-icon-toggle');
  const iconToggle = new MDCIconToggle(root);

  assert(!iconToggle.disabled, 'iconToggle has a `disabled` property');
  assert(!iconToggle.on, 'iconToggle has an `on` property');

  iconToggle.on = true;
  assert(iconToggle.on, 'setting iconToggle.on = true updates the `on` property');
  assert(root.textContent.trim() === 'favorite', 'Text content is updated');
  assert(root.getAttribute('aria-label').trim() === 'Remove from favorites', 'aria-label is updated');

  iconToggle.on = false;
  assert(!iconToggle.on, 'setting iconToggle.on = false updates the `on` property');
  assert(root.textContent.trim() === 'favorite_border', 'Text content is updated');
  assert(root.getAttribute('aria-label').trim() === 'Add to favorites', 'aria-label is updated');

  iconToggle.disabled = true;
  assert(iconToggle.disabled, 'setting iconToggle.disabled = true updates the `disabled` property');

  iconToggle.disabled = false;
})();
