"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const election_1 = require("../rpc/election");
const grpc = require("grpc");
class CommonState extends events_1.EventEmitter {
    constructor() {
        super();
        this.currentTerm = 0;
        this.votedFor = null;
        this.log = [];
        // index of highest log entry known to be
        // committed (initialized to 0, increases
        // monotonically)
        this.commitIndex = 0;
        this.lastApplied = 0;
        this.server = new grpc.Server();
        this.election = new election_1.default(this);
    }
    registerServices() {
        ;
    }
    run() {
        ;
    }
}
const events = {
    heartbeat() { },
    timeout() { },
    electing() { },
    electionEnds() {
        this.votedFor = null;
    },
    promoted() { }
};
exports.default = CommonState;
