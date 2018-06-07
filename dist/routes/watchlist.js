'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _server = require('../server');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express2.default.Router();

router.get('/', (req, res) => {
    res.render('watch', {
        initData: _server.onSublist,
        onTuple: { type: 'sublist', value: 'on' },
        offTuple: { type: 'sublist', value: 'off' }
    });
});

exports.default = router;