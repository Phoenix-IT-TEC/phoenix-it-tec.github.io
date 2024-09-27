import { __awaiter, __generator } from "tslib";
import { countries } from './resources';
import { GEO_CODE_MAP } from './country-codes/constants';
export { getCountryCodeByGEO, COUNTRIES_CODES, } from './country-codes';
var COUNTRY_TRANSLATION_PREFIX = 'locale-dataset.countries.';
var LocaleData = /** @class */ (function () {
    function LocaleData() {
    }
    LocaleData.prototype.setTranslations = function (_i18n) {
        this.translations = _i18n;
    };
    LocaleData.prototype.loadTranslations = function (createI18Next, loadTranslations) {
        var _this = this;
        this.translations = createI18Next({
            asyncMessagesLoader: function (locale) { return __awaiter(_this, void 0, void 0, function () {
                var translations;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, loadTranslations(locale)];
                        case 1:
                            translations = _a.sent();
                            return [2 /*return*/, translations];
                    }
                });
            }); },
        });
    };
    LocaleData.prototype.getAllCountries = function (existingCountries) {
        var _this = this;
        return (existingCountries || countries)
            .reduce(function (acc, value) {
            var label = _this.getCountryByKey(value);
            if (label) {
                acc.push({ value: value, label: label });
            }
            return acc;
        }, [])
            .sort(function (_a, _b) {
            var firstName = _a.label;
            var secondName = _b.label;
            return firstName < secondName ? -1 : firstName > secondName ? 1 : 0;
        });
    };
    LocaleData.prototype.getCountryByKey = function (key) {
        if (GEO_CODE_MAP[key]) {
            return this.translations.t("".concat(COUNTRY_TRANSLATION_PREFIX).concat(key));
        }
    };
    return LocaleData;
}());
export { LocaleData };
//# sourceMappingURL=index.js.map