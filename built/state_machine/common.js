"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const election_1 = require("../rpc/election");
class CommonState extends events_1.EventEmitter {
    constructor() {
        super();
        this.log = [];
        this.election = new election_1.default(this);
        this.on('requestedVote', this.onRequestedVote);
    }
    onRequestedVote() {
        ;
    }
}
exports.default = CommonState;
