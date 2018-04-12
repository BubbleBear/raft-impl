"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const PROTO_BASE_PATH = path.resolve(__dirname, '../protos');
const route = function (proto) {
    return path.resolve(PROTO_BASE_PATH, proto);
};
exports.default = route;
