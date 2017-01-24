/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import MDCFoundation from '@material/base/foundation.js';
// eslint-disable-next-line no-unused-vars
import MDCIconToggleAdapter from './adapter';

/**
 * @extends {MDCFoundation<!MDCIconToggleAdapter>}
 */
export default class MDCIconToggleFoundation extends MDCFoundation {
  /**
   * @return {!Object<string, string>}
   */
  static get cssClasses() {
    return {
      ROOT: 'mdc-icon-toggle',
      DISABLED: 'mdc-icon-toggle--disabled',
    };
  }

  /**
   * @return {!Object<string, string>}
   */
  static get strings() {
    return {
      DATA_TOGGLE_ON: 'data-toggle-on',
      DATA_TOGGLE_OFF: 'data-toggle-off',
      ARIA_PRESSED: 'aria-pressed',
      ARIA_DISABLED: 'aria-disabled',
      ARIA_LABEL: 'aria-label',
    };
  }

  /**
   * @return {!MDCIconToggleAdapter}
   */
  static get defaultAdapter() {
    return /** @type {!MDCIconToggleAdapter} */ ({
      addClass: () => {},
      removeClass: () => {},
      registerInteractionHandler: () => {},
      deregisterInteractionHandler: () => {},
      setText: () => {},
      getTabIndex: () => 0,
      setTabIndex: () => {},
      getAttr: () => '',
      setAttr: () => {},
      rmAttr: () => {},
      notifyChange: () => {},
    });
  }

  /**
   * @param {!MDCIconToggleAdapter} adapter
   */
  constructor(adapter) {
    super(Object.assign(MDCIconToggleFoundation.defaultAdapter, adapter));
    /** @private {boolean} */
    this.on_ = false;
    /** @private {boolean} */
    this.disabled_ = false;
    /** @private {number} */
    this.savedTabIndex_ = -1;
    // TODO: better types
    /** @private {?Object} */
    this.toggleOnData_ = null;
    /** @private {?Object} */
    this.toggleOffData_ = null;
    /** @private {function(): void} */
    this.clickHandler_ = () => this.toggleFromEvt_();
    /** @private {boolean} */
    this.isHandlingKeydown_ = false;
    /** @private {function(!KeyboardEvent): void} */
    this.keydownHandler_ = (evt) => {
      if (isSpace(evt)) {
        this.isHandlingKeydown_ = true;
        return evt.preventDefault();
      }
    };
    /** @private {function(!KeyboardEvent): void} */
    this.keyupHandler_ = (evt) => {
      if (isSpace(evt)) {
        this.isHandlingKeydown_ = false;
        this.toggleFromEvt_();
      }
    };
  }

  init() {
    this.refreshToggleData();
    this.adapter_.registerInteractionHandler('click', this.clickHandler_);
    this.adapter_.registerInteractionHandler('keydown', this.keydownHandler_);
    this.adapter_.registerInteractionHandler('keyup', this.keyupHandler_);
  }

  refreshToggleData() {
    const {DATA_TOGGLE_ON, DATA_TOGGLE_OFF} = MDCIconToggleFoundation.strings;
    this.toggleOnData_ = this.parseJsonDataAttr_(DATA_TOGGLE_ON);
    this.toggleOffData_ = this.parseJsonDataAttr_(DATA_TOGGLE_OFF);
  }

  destroy() {
    this.adapter_.deregisterInteractionHandler('click', this.clickHandler_);
    this.adapter_.deregisterInteractionHandler('keydown', this.keydownHandler_);
    this.adapter_.deregisterInteractionHandler('keyup', this.keyupHandler_);
  }

  /** @private */
  toggleFromEvt_() {
    this.toggle();
    const {on_: isOn} = this;
    this.adapter_.notifyChange({isOn});
  }

  /** @return {boolean} */
  isOn() {
    return this.on_;
  }

  /**
   * @param {boolean=} isOn
   */
  toggle(isOn = !this.on_) {
    this.on_ = isOn;

    const {ARIA_LABEL, ARIA_PRESSED} = MDCIconToggleFoundation.strings;
    const {content, label, cssClass} = this.on_ ? this.toggleOnData_ : this.toggleOffData_;
    const {cssClass: classToRemove} = this.on_ ? this.toggleOffData_ : this.toggleOnData_;

    if (this.on_) {
      this.adapter_.setAttr(ARIA_PRESSED, 'true');
    } else {
      this.adapter_.setAttr(ARIA_PRESSED, 'false');
    }

    if (classToRemove) {
      this.adapter_.removeClass(classToRemove);
    }
    if (cssClass) {
      this.adapter_.addClass(cssClass);
    }
    if (content) {
      this.adapter_.setText(content);
    }
    if (label) {
      this.adapter_.setAttr(ARIA_LABEL, label);
    }
  }

  /**
   * @param {string} dataAttr
   * @return {!Object} todo better type
   * @private
   */
  parseJsonDataAttr_(dataAttr) {
    const val = this.adapter_.getAttr(dataAttr);
    if (!val) {
      return {};
    }
    return /** @type {!Object} */ (JSON.parse(val));
  }

  /** @return {boolean} */
  isDisabled() {
    return this.disabled_;
  }

  /**
   * @param {boolean} isDisabled
   */
  setDisabled(isDisabled) {
    this.disabled_ = isDisabled;

    const {DISABLED} = MDCIconToggleFoundation.cssClasses;
    const {ARIA_DISABLED} = MDCIconToggleFoundation.strings;

    if (this.disabled_) {
      this.savedTabIndex_ = this.adapter_.getTabIndex();
      this.adapter_.setTabIndex(-1);
      this.adapter_.setAttr(ARIA_DISABLED, 'true');
      this.adapter_.addClass(DISABLED);
    } else {
      this.adapter_.setTabIndex(this.savedTabIndex_);
      this.adapter_.rmAttr(ARIA_DISABLED);
      this.adapter_.removeClass(DISABLED);
    }
  }

  /**
   * @return {boolean}
   */
  isKeyboardActivated() {
    return this.isHandlingKeydown_;
  }
}

/**
 * @param {!{key: string, keyCode: number}} data
 * @return {boolean}
 */
function isSpace({key, keyCode}) {
  return Boolean(key && key === 'Space' || keyCode === 32);
}
