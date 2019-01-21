'use strict';

module.exports = function Chinese(runtime) {
    runtime.preset['zh-cn'] = {
        concat: '',
        levels: {
            '亿': 100000000,
            '千万': 10000000,
            '百万': 1000000,
            '十万': 100000,
            '万': 10000,
            '千': 1000,
            '百': 100,
            '十': 10,
            '': 1
        },
        template: ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'],
        translate: function () {
            const { template, levels, concat } = this,
                len = arguments.length;
            if (len === 2) {
                const [val, cache] = arguments,
                    vaildCount = cache.filter(cur => cur && cur !== '负').length,
                    tail = String(val).match(/[^\.]+$/)[0]
                        .replace(/./g, (cur, i, src) =>
                            `${template[cur]}${i === src.length - 1 ? '' : concat}`
                        );
                return (vaildCount ? [] : [template[0]]).concat(
                    ['点', tail]
                ).join(concat);
            }
            const [val, key, n, cache, i, keys] = arguments,
                vaildCount = cache.filter(cur => cur && cur !== '负').length,
                [fir, sec] = [...key];
            return (n < 0 ? ['负'] : []).concat(val > 0 ? [
                ...(vaildCount && !cache.previous ? [template[0]] : []),
                template[val],
                Math.abs(n) >= levels[sec] ? fir : key
            ] : n ? [] : [template[0]]).join(concat);
        },
        regular: function () {
            const { levels, template } = this,
                [zero, vals] = [
                    template[0], template.slice(1).join('')
                ];
            return new RegExp(`^(负)?${Object.keys(levels).map(cur => {
                cur = cur.length > 1 ? cur.substring(0, 1) : cur;
                return `${zero}?([${vals}])?${cur ? `(${cur})?` : ''}`;
            }).join('')}(点[${zero + vals}]+)?$`);
        },
        from: function (ctn, i, ar) {
            const { levels, template } = this;
            if (/^点.+/.test(ctn)) return Number(ctn.replace(/./g, cur =>
                /^点$/.test(cur) ? '0.' : template.indexOf(cur)
            ));
            if (!(/^[^负]$/.test(ctn))) return ctn ? -1 : 0;
            const ind = template.indexOf(ctn);
            if (ind === -1) return 0;
            const cache = [ind];
            ar.slice(i).some(cur => {
                cur = levels[cur];
                if (cur) {
                    (cache.length === 1 || cur > cache[cache.length - 1]) && (
                        cache.push(cur)
                    );
                }
                return cache.length >= 3;
            });
            return cache.reduce((res, cur) => res * cur);
        }
    };
};