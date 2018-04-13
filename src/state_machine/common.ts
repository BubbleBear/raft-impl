import { EventEmitter } from 'events';
import Election from '../rpc/election';
import { Entry } from '../types';
import * as grpc from 'grpc';

class CommonState extends EventEmitter {
    id: number;

    config;

    currentTerm: number = 0;

    votedFor: number = null;

    log: Array<Entry> = [];

    // index of highest log entry known to be
    // committed (initialized to 0, increases
    // monotonically)
    commitIndex: number = 0;

    lastApplied: number = 0;

    election: Election;

    server: any = new grpc.Server();

    constructor() {
        super();
        this.election = new Election(this);
    }

    registerServices() {
        ;
    }

    run() {
        ;
    }
}

const events = {
    heartbeat() {},

    timeout() {},

    electing() {},

    electionEnds() {
        this.votedFor = null;
    },

    promoted() {}
}

export default CommonState;
