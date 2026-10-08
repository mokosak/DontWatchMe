// ==UserScript==
// @name         DontWatchMe
// @version      3.0
// @description  Stops pages from detecting when you switch tabs or windows, and removes restrictions on selecting, copying and pasting text.
// @match        *://*/*
// @run-at       document-start
// @all-frames   true
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  var blocked = Object.create(null);
  var names = [
    'visibilitychange', 'webkitvisibilitychange',
    'blur', 'focus', 'focusin', 'focusout',
    'unload', 'beforeunload', 'pagehide',
    'selectstart', 'selectionchange',
    'copy', 'cut', 'paste', 'beforecopy', 'beforecut', 'beforepaste',
    'DOMSubtreeModified', 'DOMNodeInserted', 'DOMNodeRemoved',
    'DOMNodeRemovedFromDocument', 'DOMNodeInsertedIntoDocument',
    'DOMCharacterDataModified'
  ];
  for (var i = 0; i < names.length; i++) blocked[names[i]] = 1;

  var origAdd = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function (type, listener, options) {
    if (blocked[type]) return;
    return origAdd.call(this, type, listener, options);
  };

  try {
    var visible = { get: function () { return 'visible'; }, configurable: true };
    var notHidden = { get: function () { return false; }, configurable: true };
    Object.defineProperties(document, {
      visibilityState: visible,
      webkitVisibilityState: visible,
      hidden: notHidden,
      webkitHidden: notHidden
    });
  } catch (e) {}

  try { Document.prototype.hasFocus = function () { return true; }; } catch (e) {}

  try {
    var noop = { get: function () { return null; }, set: function () {}, configurable: true };
    var props = ['onselectionchange', 'onselectstart', 'oncopy', 'oncut', 'onpaste'];
    for (var j = 0; j < props.length; j++) Object.defineProperty(document, props[j], noop);
  } catch (e) {}
})();
