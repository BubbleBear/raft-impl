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

    timer: any = null;

    electionTimer: any = null;

    constructor() {
        super();
        this.election = new Election(this);
        this.registerEvents();
    }

    registerEvents() {
        Reflect.ownKeys(events).map((v: string) => {
            this.on(v, events[v].bind(this));
        });
    }

    run() {
        ;
    }

    campaign() {
        this.config.map((v) => {
            const target = { host: v.host, port: v.port };
            this.election.requestVote(target);
        });
    }

    resetTimer() {
        console.log(`id: ${this.id} resetTimer`);
    }

    resetElectionTimer() {
        clearTimeout(this.electionTimer);
        this.electionTimer = setTimeout(() => {
            this.emit('electionTimeout');
        }, 300 * Math.random());
        console.log(`id: ${this.id} resetElectionTimer`);
    }
}

const events = {
    timeout() {
        console.log('timeout');
        this.leaderId = null;
        // this.votedFor = this.id;
        this.emit('electionStarts');
    },

    electionStarts() {
        console.log('election starts');
        this.currentTerm++;
        this.electionTimer = setTimeout(() => {
            this.emit('electionTimeout');
        }, 300 * Math.random());
        this.campaign();
    },

    voted() {
        const majority = this.config.length / 2;
        this.votes++;
        console.log(`voted.\tvotes: ${this.votes}`);
        if (this.votes > majority) {
            this.emit('electionEnds');
            this.emit('elected');
        }
    },

    electionTimeout() {
        console.log('election timeout');
        this.votes = 0;
        this.resetElectionTimer();
        this.campaign();
    },

    electionEnds() {
        clearTimeout(this.electionTimer);
        this.electionTimer = null;
        console.log('election ends');
        this.votedFor = null;
        this.votes = 0;
    },

    elected() {
        this.leaderId = this.id;
        console.log(`${this.id} has become leader`);
    }
}

export default CommonState;
