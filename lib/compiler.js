'use strict';

const assert = require('assert');

const Compiler = module.exports = function (lang) {
    const version = pre[lang];
    assert(version, `${lang} package isn't exist.`);
    this.options = version;
};

Compiler.prototype = {
    constructor: Compiler,
    parse: function (n) {
        const { levels, concat, translate } = this.options,
            cache = [],
            len = (String(n).match(/\..+$/) || ['.'])[0].length - 1;
        cache.previous = true;
        Object.keys(levels).sort((fk, sk) =>
            levels[fk] < levels[sk] ? 1 : -1
        ).every((key, i, keys) => {
            const val = levels[key],
                temp = Math.floor(Math.abs(n / val));
            n = Number((n % val).toFixed(len));
            cache.push(translate.call(
                this.options, temp, key, n, cache, i, keys
            ));
            n < 0 && (n = Math.abs(n));
            cache.previous = temp !== 0;
            return n;
        });
        n !== 0 && (cache.push(
            translate.call(this.options, n, cache)
        ));
        return cache.filter(cur => cur).join(concat);
    },
    numberify: function (series) {
        const { regular, from } = this.options,
            groups = series.match(regular.call(this.options));
        assert(groups, `${series} is invaild.`);
        return groups.slice(1).map((cur, i, ar) =>
            from.call(this.options, cur, i, ar)
        ).reduce((res, cur) => (cur < 0 ?
            (res[0] = -1) : ((res[1] += cur) || 1)
        ) && res, [1, 0]).reduce((fir, sec) => fir * sec);
    }
};

const pre = Compiler.preset = {};

Compiler.plugins = require('../number.config').filter(plugin =>
    plugin(Compiler) || 1
);
