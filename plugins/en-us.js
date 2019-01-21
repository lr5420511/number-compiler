'use strict';

module.exports = function English(runtime) {
    runtime.preset['en-us'] = {
        concat: ' ',
        levels: {
            'billion': 1000000000,
            'hundred million': 100000000,
            'ninety million': 90000000,
            'eighty million': 80000000,
            'seventy million': 70000000,
            'sixty million': 60000000,
            'fifty million': 50000000,
            'forty million': 40000000,
            'thirty million': 30000000,
            'twenty million': 20000000,
            'nineteen million': 19000000,
            'eighteen million': 18000000,
            'seventeen million': 17000000,
            'sixteen million': 16000000,
            'fifteen million': 15000000,
            'fourteen million': 14000000,
            'thirteen million': 13000000,
            'twelve million': 12000000,
            'eleven million': 11000000,
            'ten million': 10000000,
            'million': 1000000,
            'hundred thousand': 100000,
            'ninety thousand': 90000,
            'eighty thousand': 80000,
            'seventy thousand': 70000,
            'sixty thousand': 60000,
            'fifty thousand': 50000,
            'forty thousand': 40000,
            'thirty thousand': 30000,
            'twenty thousand': 20000,
            'nineteen thousand': 19000,
            'eighteen thousand': 18000,
            'seventeen thousand': 17000,
            'sixteen thousand': 16000,
            'fifteen thousand': 15000,
            'fourteen thousand': 14000,
            'thirteen thousand': 13000,
            'twelve thousand': 12000,
            'eleven thousand': 11000,
            'ten thousand': 10000,
            'thousand': 1000,
            'hundred': 100,
            'ninety': 90,
            'eighty': 80,
            'seventy': 70,
            'sixty': 60,
            'fifty': 50,
            'forty': 40,
            'thirty': 30,
            'twenty': 20,
            'nineteen': 19,
            'eighteen': 18,
            'seventeen': 17,
            'sixteen': 16,
            'fifteen': 15,
            'fourteen': 14,
            'thirteen': 13,
            'twelve': 12,
            'eleven': 11,
            'ten': 10,
            '': 1
        },
        template: ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'],
        singler: /^(ninety|eighty|seventy|sixty|fifty|forty|thirty|twenty|nineteen|eighteen|seventeen|sixteen|fifteen|fourteen|thirteen|twelve|eleven|ten)( (million|thousand))?$/,
        translate: function () {
            const { template, concat, levels, singler } = this,
                len = arguments.length;
            if (len === 2) {
                const [val, cache] = arguments,
                    vailds = cache.filter(cur => cur && cur !== 'negative').length,
                    tail = String(val).match(/[^\.]+$/)[0].replace(/./g, (cur, i, src) =>
                        `${template[cur]}${i === src.length - 1 ? '' : concat}`
                    );
                return (vailds ? [] : [template[0]]).concat([
                    'point', tail
                ]).join(concat);
            }
            const [val, key, n, cache, i, keys] = arguments,
                [fir, sec] = key.match(/[^ ]+/g) || [];
            return (n < 0 ? ['negative'] : []).concat(val > 0 ? [
                ...(singler.test(key) ? [] : [template[val]]).concat(Math.abs(n) >= levels[sec] ?
                    [fir] : (key ? [key] : [])
                )
            ] : (n ? [] : [template[0]])).join(concat);
        },
        regular: function () {
            const { concat, levels, template, singler } = this,
                [re, zero, vals] = [/[^ ]+/g, template[0], template.slice(1).join('|')];
            return new RegExp(`^(negative)?${Object.keys(levels).map(key => {
                const head = (key.match(re) || [])[0];
                return `(?:${concat})?${singler.test(key) ? `(${head})?` : `(${head ? vals : `${zero}|${vals}`})?(?:${concat})?${head ? `(${head})?` : ''}`}`;
            }).join('')}(?:${concat})?(point(?:(?:${concat})(?:${zero}|${vals}))+)?$`);
        },
        from: function (ctn, i, ar) {
            if (!ctn || /^(billion|million|thousand|hundred)$/.test(ctn)) return 0;
            if (/^negative$/.test(ctn)) return -1;
            const { levels, template } = this;
            if (/^point/.test(ctn)) return Number(ctn.match(/[^ ]+/g).map(cur =>
                cur === 'point' ? '0.' : template.indexOf(cur)
            ).join(''));
            const vals = [levels[ctn] || template.indexOf(ctn)];
            ar.slice(i + 1).some(cur => {
                cur = levels[cur];
                if (cur) {
                    (vals.length === 1 && (vals.push(cur))) || (
                        cur > vals[1] && (vals.push(cur))
                    );
                }
                return vals.length === 3;
            });
            return vals.reduce((fir, sec) => fir * sec);
        }
    };
};