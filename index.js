'use strict';

const Compiler = require('./lib/compiler');

const func = module.exports = lang => new Compiler(lang);

func.plugins = Compiler.plugins;