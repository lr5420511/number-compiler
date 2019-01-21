'use strict';

const RomanPlugin = require('./plugins/roman');
const ChinesePlugin = require('./plugins/zh-cn');
const EnglishPlugin = require('./plugins/en-us');

module.exports = [
    RomanPlugin, ChinesePlugin, EnglishPlugin
];