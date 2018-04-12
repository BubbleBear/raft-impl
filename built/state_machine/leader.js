"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
class LeaderState extends common_1.default {
    constructor() {
        super(...arguments);
        this.nextIndex = [];
        this.matchIndex = [];
    }
}
exports.default = LeaderState;
