/** @record */
export default class MDCRippleAdapter {
  /**
   * @return {boolean}
   */
  browserSupportsCssVars() {}

  /**
   * @return {boolean}
   */
  isUnbounded() {}

  /**
   * @return {boolean}
   */
  isSurfaceActive() {}

  /**
   * @param {string} className
   */
  addClass(className) {}

  /**
   * @param {string} className
   */
  removeClass(className) {}

  /**
   * @param {string} type
   * @param {!Function} handler
   */
  registerInteractionHandler(type, handler) {}

  /**
   * @param {string} type
   * @param {!Function} handler
   */
  deregisterInteractionHandler(type, handler) {}

  /**
   * @param {!Function} handler
   */
  registerResizeHandler(handler) {}

  /**
   * @param {!Function} handler
   */
  deregisterResizeHandler(handler) {}

  /**
   * @param {string} varName
   * @param {?string} value
   */
  updateCssVariable(varName, value) {}

  /**
   * @return {!ClientRect}
   */
  computeBoundingRect() {}

  /**
   * @return {!{x: number, y: number}}
   */
  getWindowPageOffset() {}
}
