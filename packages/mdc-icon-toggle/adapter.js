/** @record */
export default class MDCIconToggleAdapter {
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
   * @param {string} text
   */
  setText(text) {}

  /**
   * @return {number}
   */
  getTabIndex() {}

  /**
   * @param {number} tabIndex
   */
  setTabIndex(tabIndex) {}

  /**
   * @param {string} name
   * @return {string}
   */
  getAttr(name) {}

  /**
   * @param {string} name
   * @param {string} value
   */
  setAttr(name, value) {}

  /**
   * @param {string} name
   */
  rmAttr(name) {}

  /**
   * @param {!{isOn: boolean}} evtData
   */
  notifyChange(evtData) {}
}
