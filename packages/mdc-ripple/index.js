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

import MDCComponent from '@material/base/component.js';
import MDCRippleFoundation from './foundation';
import MDCRippleAdapter from './adapter'; // eslint-disable-line no-unused-vars
import {supportsCssVariables, getMatchesProperty} from './util';

/** @const {string} */
const MATCHES = getMatchesProperty(HTMLElement.prototype);

export {MDCRippleFoundation};

/**
 * @extends {MDCComponent<!MDCRippleFoundation>}
 */
export class MDCRipple extends MDCComponent {
  /**
   * @param {!Element} root
   * @param {{isUnbounded: (boolean|undefined)}=} opts
   * @return {!MDCRipple}
   */
  static attachTo(root, {isUnbounded = undefined} = {}) {
    const ripple = new MDCRipple(root);
    // Only override unbounded behavior if option is explicitly specified
    if (isUnbounded !== undefined) {
      ripple.unbounded = isUnbounded;
    }
    return ripple;
  }

  /**
   * @param {!MDCComponent} instance
   * @return {!MDCRippleAdapter}
   */
  static createAdapter(instance) {
    return {
      browserSupportsCssVars: () => supportsCssVariables(window),
      isUnbounded: () => /** @type {?} */ (instance).unbounded,
      isSurfaceActive: () => instance.root[MATCHES](':active'),
      addClass: (className) => instance.root.classList.add(className),
      removeClass: (className) => instance.root.classList.remove(className),
      registerInteractionHandler: (evtType, handler) => instance.root.addEventListener(evtType, handler),
      deregisterInteractionHandler: (evtType, handler) => instance.root.removeEventListener(evtType, handler),
      registerResizeHandler: (handler) => window.addEventListener('resize', handler),
      deregisterResizeHandler: (handler) => window.removeEventListener('resize', handler),
      updateCssVariable: (varName, value) => instance.root.style.setProperty(varName, value),
      computeBoundingRect: () => instance.root.getBoundingClientRect(),
      getWindowPageOffset: () => ({x: window.pageXOffset, y: window.pageYOffset}),
    };
  }

  /**
   * @param {...?} args
   */
  constructor(...args) {
    super(...args);
    /** @private {boolean} */
    this.unbounded_ = false;

    /** @type {boolean} */
    this.unbounded;
  }

  /**
   * @return {boolean}
   */
  get unbounded() {
    return this.unbounded_;
  }

  /**
   * @param {boolean} unbounded
   */
  set unbounded(unbounded) {
    const {UNBOUNDED} = MDCRippleFoundation.cssClasses;
    this.unbounded_ = Boolean(unbounded);
    if (this.unbounded_) {
      this.root_.classList.add(UNBOUNDED);
    } else {
      this.root_.classList.remove(UNBOUNDED);
    }
  }

  activate() {
    this.foundation_.activate();
  }

  deactivate() {
    this.foundation_.deactivate();
  }

  /**
   * @return {!MDCRippleFoundation}
   */
  getDefaultFoundation() {
    return new MDCRippleFoundation(MDCRipple.createAdapter(this));
  }

  initialSyncWithDOM() {
    this.unbounded = 'mdcRippleIsUnbounded' in this.root_.dataset;
  }
}
