'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.changeGameRendering = changeGameRendering;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

require('./index.css');

var _reactrestReactRest = require("./reactrest/reactRest");

var _cryptoJs = require('crypto-js');

var _createdShas = require('./created/shas');

var loader = function loader(url) {
    return fetch(url).then(function (response) {
        return response.text();
    });
};

console.log(" CryptoJS.SHA256", _cryptoJs.SHA256);

var cache = new _reactrestReactRest.ReactRestCache(loader, _cryptoJs.SHA256);

console.log("shas1", _createdShas.shas);
console.log("shas1.game", _createdShas.shas.game);
var gameJson = {
    _links: { _self: { href: "someUrl/For/This/Game" } },
    _render: { _self: _createdShas.shas.game },
    gameData: 'Some game data properties could go here',
    _embedded: {
        board: {
            _links: { _self: { href: "someUrl/For/The/Board" } },
            _render: { _self: _createdShas.shas.board, square: _createdShas.shas.square },
            squares: [1, 2, 3, 4, 5, 6, 7, 8, 9]
        }
    }
};
var game2Json = {
    _links: { _self: { href: "someUrl/For/This/Game" } },
    _render: { _self: _createdShas.shas.game },
    gameData: 'Some game data properties could go here',
    _embedded: {
        board: {
            _links: { _self: { href: "someUrl/For/The/Board" } },
            _render: { _self: _createdShas.shas.board, square: _createdShas.shas.square2 },
            squares: [1, 2, 3, 4, 5, 6, 7, 8, 9]
        }
    }
};

function renderIt(json, element) {
    return cache.loadFromBlob(json).then(function (theyAreLoaded) {
        var reactRest = new _reactrestReactRest.ReactRest(_react2['default'].createElement, cache);
        var reactComponentClass = reactRest.renderSelf(json);
        console.log("renderIt", reactComponentClass, json);
        return _reactDom2['default'].render(reactComponentClass, element);
    });
}

function startGame() {
    console.log("restartGame");
    console.log("shas", _createdShas.shas);
    console.log("json", gameJson);
    var result = renderIt(gameJson, document.getElementById('root'));
    result.then(function (r) {
        return console.log("resultOfRestartGame", r);
    });
    return result;
}

// console.log(findAllRenderUrls(gameJson))
var gamePromise = startGame();

function changeGameRendering(json) {
    console.log("renderUrls", cache.findAllRenderUrls(json));
    cache.loadFromBlob(json);
    gamePromise.then(function (game) {
        return game.setState(json);
    });
}