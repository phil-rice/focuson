"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var e = _react2["default"].createElement;

function Square2(props) {
    return e("button", { className: "square", onClick: function onClick() {
            return props.data.onClick();
        } }, props.data.value + "x");
}
Square2;