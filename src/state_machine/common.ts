import { EventEmitter } from 'events';
import Election from '../rpc/election';
import { Entry } from '../types';
import * as grpc from 'grpc';
import Replication from '../rpc/replication';

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

    replication: Replication;

    server: any = new grpc.Server();

    timer: any = null;

    electionTimer: any = null;

    constructor() {
        super();
        this.election = new Election(this);
        this.replication = new Replication(this);
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
        this.config.hosts.map((v) => {
            const target = { host: v.host, port: v.port };
            this.election.requestVote(target);
        });
    }

    heartbeat() {
        this.config.hosts.map((v) => {
            const target = { host: v.host, port: v.port };
            this.replication.appendEntries(target);
        })
    }

    newTerm(term?: number) {
        term && (this.currentTerm < term) && (this.currentTerm = term) || this.currentTerm++;
        this.leaderId = null;
        this.votedFor = null;
        this.votes = 0;
    }

    resetTimer() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.emit('timeout');
        }, this.config.minTimeout + (this.config.maxTimeout - this.config.minTimeout) * Math.random());
        console.log(`id: ${this.id} resetTimer`);
    }

    startElection() {
        console.log(`election starts: current term: ${this.currentTerm}`);
        this.newTerm();
        this.resetElectionTimer();
        this.campaign();
    }

    resetElectionTimer() {
        clearTimeout(this.electionTimer);
        this.electionTimer = setTimeout(() => {
            this.emit('electionTimeout');
        }, this.config.minElectionTimeout + (this.config.maxElectionTimeout - this.config.minElectionTimeout) * Math.random());
        console.log(`id: ${this.id} resetElectionTimer`);
    }

    endElection() {
        clearTimeout(this.electionTimer);
        this.electionTimer = null;
        console.log('election ends');
    }
}

const events = {
    timeout() {
        console.log('timeout');
        this.leaderId = null;
        this.startElection();
    },

    electionTimeout() {
        console.log('election timeout');
        this.endElection();
        this.startElection();
    },

    voted() {
        const majority = this.config.hosts.length / 2;
        this.votes++;
        console.log(`voted.\tvotes: ${this.votes}`);
        if (this.votes > majority) {
            this.endElection();
            this.emit('elected');
        }
    },

    elected() {
        this.leaderId = this.id;
        clearTimeout(this.timer);
        console.log(`${this.id} has become leader`);
    }
}

export default CommonState;
