import * as grpc from 'grpc';
import protoRoute from '../proto_route';
import StateMachine from '../state_machine/common';
const proto = grpc.load(protoRoute('election.proto')).raft;

class Election {
    stateEntity: StateMachine;

    constructor(stateEntity: StateMachine) {
        this.stateEntity = stateEntity;
        this.stateEntity.server.addService(proto.Election.service, {requestVote: this.voteWrapper()});
    }

    requestVote(target) {
        const s = this.stateEntity;
        const client = new proto.Election(`${target.host}:${target.port}`, grpc.credentials.createInsecure());
        client.requestVote({
            term: s.currentTerm,
            candidateId: s.id,
            // lastLogIndex: s.log.length - 1,
            // lastLogTerm: s.log[s.log.length - 1].term
        }, (err, res) => {
            if (err) {
                console.log(err.details);
                return;
            }
            console.log(res);
            res && res.granted && this.stateEntity.emit('voted');
        });
    }

    voteWrapper() {
        const self = this;
        return function vote(call, callback) {
            const s = self.stateEntity;
            const req = call.request;
            // s.resetTimer();
            if (s.currentTerm < req.term) {
                s.newTerm(req.term);
            }
            if (s.currentTerm > req.term ||
                s.votedFor != null ||
                0) {
                callback(null, { term: s.currentTerm, granted: false });
            } else {
                s.votedFor = req.candidateId;
                callback(null, { term: s.currentTerm, granted: true });
            }
        }
    }
}

export default Election;
