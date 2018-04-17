import * as grpc from 'grpc';
import protoRoute from '../proto_route';
import StateMachine from '../state_machine/common';
const proto = grpc.load(protoRoute('election.proto')).raft;

class Replication {
    stateEntity: StateMachine;

    constructor(stateEntity: StateMachine) {
        this.stateEntity = stateEntity;
        this.stateEntity.server.addService(proto.Replication.service, {appendEntry: this.entryWrapper()});
    }

    appendEntries(target) {
        const s = this.stateEntity;
        const client = proto.Replication(`${target.host}:${target.port}`, grpc.credentials.createInsecure());
        client.appendEntry({
            term: s.currentTerm,
            leaderId: s.id,
            prevLogIndex: 1,
            prevLogTerm: 1,
            entries: [],
            leaderCommit: 1
        }, (err, res) => {
            if (err) {
                console.log(err.details);
                return;
            }
            console.log(res);
        });
    }

    entryWrapper() {
        const self = this;
        return function entry(call, callback) {
            const s = self.stateEntity;
            const req = call.request;
            // s.resetTimer();
            if (s.currentTerm < req.term) {
                s.newTerm(req.term);
            }
            if (false) {
                callback(null, { term: s.currentTerm, success: false });
            } else {
                callback(null, { term: s.currentTerm, success: true });
            }
        }
    }
}

export default Replication;
