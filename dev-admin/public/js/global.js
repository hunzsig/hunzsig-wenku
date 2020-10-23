/**
 * 事件触发
 * @param element
 * @param event
 * @returns {*}
 */
var triggerEvent = function (element, event) {
  var evt = null;
  if (document.createEventObject) {
    // IE浏览器支持fireEvent方法
    evt = document.createEventObject();
    return element.fireEvent('on' + event, evt);
  }
  // 其他标准浏览器使用dispatchEvent方法
  evt = document.createEvent('HTMLEvents');
  // initEvent接受3个参数：
  // 事件类型，是否冒泡，是否阻止浏览器的默认行为
  evt.initEvent(event, true, true);
  return !element.dispatchEvent(evt);
};

/**
 * 调用JS Click
 * @param id
 * @param prams
 */
var jsClick = function (id, prams = null) {
  if (prams !== null) {
    const htmlPrams = document.getElementById(id);
    htmlPrams.name = prams;
  }
  triggerEvent(document.getElementById(id), 'click');
};
