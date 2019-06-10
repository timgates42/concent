"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _constant = require("../../support/constant");

var _util = require("../../support/util");

var _default = function _default(spec, e, stateFor) {
  var _ref;

  var ccint = '',
      ccsync = '',
      ccidt = '',
      value = '',
      ccdelay = -1,
      isToggleBool = false;
  var specSyncKey = spec[_constant.CCSYNC_KEY];
  var type = spec.type;

  if (specSyncKey !== undefined) {
    //来自生成的sync生成的setter函数调用
    ccsync = specSyncKey;
    ccdelay = spec.delay;
    ccidt = spec.idt;

    if (type === 'val') {
      //set value
      //优先从spec里取，取不到的话，从e里面分析并提取
      var val = spec.val;

      if (val === undefined) {
        if ((0, _util.isEvent)(e)) {
          value = e.currentTarget.value;
        } else {
          value = e;
        }
      } else {
        value = val;
      }
    } else if (type === 'bool') {
      //toggle bool
      isToggleBool = true;
    } else if (type === 'int') {
      //convert
      ccint = true;
    } else return null;
  } else {
    //来自于sync直接调用 <input data-ccsync="foo/f1" onChange={this.sync} /> 
    if ((0, _util.isEvent)(e)) {
      // e is event
      var currentTarget = e.currentTarget;
      value = currentTarget.value;
      var dataset = currentTarget.dataset;
      if (type === 'int') ccint = true;else ccint = dataset.ccint != undefined;
      ccsync = dataset.ccsync;
      if (!ccsync) return null;
      ccidt = dataset.ccidt;
      var dataSetDelay = dataset.ccdelay;

      if (dataSetDelay) {
        try {
          ccdelay = parseInt(dataSetDelay);
        } catch (err) {}
      }
    } else {
      //<Input onChange={this.sync}/> is invalid
      return null;
    }
  }

  return _ref = {}, _ref[_constant.MOCKE_KEY] = 1, _ref.currentTarget = {
    value: value,
    dataset: {
      ccsync: ccsync,
      ccint: ccint,
      ccdelay: ccdelay,
      ccidt: ccidt
    }
  }, _ref.stateFor = stateFor, _ref.isToggleBool = isToggleBool, _ref;
};

exports["default"] = _default;