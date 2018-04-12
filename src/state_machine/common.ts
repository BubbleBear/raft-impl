import { EventEmitter } from 'events';
import Election from '../rpc/election';
import Entry from '../entry';

class CommonState extends EventEmitter {
    id: number;

    config;

    currentTerm: number;

    votedFor: number;

    log: Array<Entry> = [];

    // index of highest log entry known to be
    // committed (initialized to 0, increases
    // monotonically)
    commitIndex: number;

    lastApplied: number;

    election: Election;

    constructor() {
        super();
        this.election = new Election(this);
        this.on('requestedVote', this.onRequestedVote);
    }

    onRequestedVote() {
        ;
    }
}

export default CommonState;
