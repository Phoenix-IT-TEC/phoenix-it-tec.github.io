import { keyCodes } from './a11y';
export const isThemeFont = (value) => /^font_\d+$/.test(value);
export const debounce = (fn, ms = 0, { leading = false, trailing = true } = {}) => {
    let timeoutId = null;
    return function (...args) {
        if (leading && timeoutId === null) {
            fn.apply(this, args);
        }
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        if (!trailing || !leading || timeoutId) {
            timeoutId = setTimeout(() => {
                if (trailing) {
                    fn.apply(this, args);
                }
                timeoutId = null;
            }, ms);
        }
        else {
            // Special case for a single call with both leading and trailing (see tests)
            timeoutId = setTimeout(() => {
                timeoutId = null;
            }, ms);
        }
    };
};
export const throttle = (func, ms = 0) => {
    let isThrottled = false, savedArgs;
    function wrapper(...args) {
        if (isThrottled) {
            savedArgs = args;
            return;
        }
        func.apply(this, args);
        isThrottled = true;
        setTimeout(() => {
            isThrottled = false;
            if (savedArgs) {
                wrapper.apply(this, savedArgs);
                savedArgs = null;
            }
        }, ms);
    }
    return wrapper;
};
export const isBrowser = () => typeof window !== `undefined`;
export const performOnEnter = (fn) => {
    return function (event) {
        if (event.keyCode === keyCodes.enter) {
            fn(event);
        }
    };
};
export const isCSSMaskSupported = () => {
    if (!isBrowser()) {
        return true;
    }
    return (window.CSS &&
        window.CSS.supports('(mask-repeat: no-repeat) or (-webkit-mask-repeat: no-repeat)'));
};
export const isEmptyObject = (obj) => !obj || (Object.keys(obj).length === 0 && obj.constructor === Object);
export const isSafari = () => /^((?!chrome|android).)*safari/i.test(navigator?.userAgent);
export const getDataAttributes = (props) => {
    return Object.entries(props).reduce((acc, [key, val]) => {
        if (key.includes('data-')) {
            acc[key] = val;
        }
        return acc;
    }, {});
};
export function pick(source, keys) {
    return keys.reduce((acc, key) => {
        if (!source.hasOwnProperty(key)) {
            return acc;
        }
        return {
            ...acc,
            [key]: source[key],
        };
    }, {});
}
export const idToCompRef = (id) => ({ id, type: 'DESKTOP' });
export const isWixDomain = (url) => ['editorx.io', 'wixsite.com', 'wix.com', 'wixstudio.io'].some(domain => url.includes(domain));
//# sourceMappingURL=utils.js.map