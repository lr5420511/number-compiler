'use strict';

module.exports = function Roman(runtime) {
    runtime.preset['roman'] = {
        concat: '',
        levels: {
            'm': 1000000,
            'cm': 900000,
            'd': 500000,
            'cd': 400000,
            'c': 100000,
            'xc': 90000,
            'l': 50000,
            'xl': 40000,
            'x': 10000,
            'Mx': 9000,
            'v': 5000,
            'Mv': 4000,
            'M': 1000,
            'CM': 900,
            'D': 500,
            'CD': 400,
            'C': 100,
            'XC': 90,
            'L': 50,
            'XL': 40,
            'X': 10,
            'IX': 9,
            'V': 5,
            'IV': 4,
            'I': 1
        },
        translate: function () {
            const [n, key] = arguments;
            return typeof key === 'string' ? key.repeat(n) : undefined;
        },
        regular: function () {
            const lvls = this.levels;
            return new RegExp(`^${Object.keys(lvls).map(cur =>
                `(${cur.length === 1 ? cur + '+' : cur})?`
            ).join('')}$`);
        },
        from: function (ctn) {
            if (!ctn) return 0;
            const lvls = this.levels;
            return /^(.)\1*$/.test(ctn) ? ctn.length * lvls[ctn[0]] : lvls[ctn];
        }
    };
};