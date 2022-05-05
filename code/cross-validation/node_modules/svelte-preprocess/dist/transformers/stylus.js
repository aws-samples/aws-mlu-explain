"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformer = void 0;
const path_1 = __importDefault(require("path"));
const stylus_1 = __importDefault(require("stylus"));
const utils_1 = require("../modules/utils");
const transformer = ({ content, filename, options = {}, }) => {
    options = {
        paths: (0, utils_1.getIncludePaths)(filename, options.paths),
        ...options,
    };
    return new Promise((resolve, reject) => {
        const style = (0, stylus_1.default)(content, {
            filename,
            ...options,
        }).set('sourcemap', options.sourcemap);
        style.render((err, css) => {
            // istanbul ignore next
            if (err)
                reject(err);
            resolve({
                code: css,
                map: style.sourcemap,
                // .map() necessary for windows compatibility
                dependencies: style
                    .deps(filename)
                    .map((filePath) => path_1.default.resolve(filePath)),
            });
        });
    });
};
exports.transformer = transformer;
