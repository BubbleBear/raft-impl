import { EventEmitter } from 'events';
import Election from '../rpc/election';
import { Entry } from '../types';
import * as grpc from 'grpc';

class CommonState extends EventEmitter {
    id: number;

    config;

    currentTerm: number = 0;

    // implicit states:
    // 1. follower if id != leaderId && id != votedFor
    // 2. candidate if id != leaderId && id == votedFor
    // 3. leader if id == leaderId
    leaderId: number = null;

    votedFor: number = null;

    votes: number = 0;

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
        this.registerEvents();
    }

    registerEvents() {
        Reflect.ownKeys(events).map((v: string) => {
            this.removeAllListeners(v);
            this.on(v, events[v].bind(this));
        });
    }

    run() {
        ;
    }

    campaign() {
        this.resetElectionTimer();
        this.config.map((v) => {
            const target = { host: v.host, port: v.port };
            this.election.requestVote(target);
        });
    }

    resetTimer() {
        console.log(this.id);
    }

    resetElectionTimer() {
        ;
    }
}

const events = {
    timeout() {
        this.leaderId = null;
        this.votedFor = this.id;
    },

    electionStarts() {
        this.currentTerm++;
        this.campaign();
    },

    voted() {
        const majority = this.config.length / 2 + 1;
        this.votes++;
        if (this.votes > majority) {
            this.emit('electionEnds');
            this.emit('elected');
        }
    },

    electionTimeout() {
        this.campaign();
    },

    electionEnds() {
        this.votedFor = null;
    },

    elected() {
        this.leaderId = this.id;
    }
}

export default CommonState;
