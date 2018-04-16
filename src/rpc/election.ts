import * as grpc from 'grpc';
import protoRoute from '../proto_route';
import stateMachine from '../state_machine/common';
const proto = grpc.load(protoRoute('election.proto')).raft;

class Election {
    stateEntity: stateMachine;

    constructor(stateEntity: stateMachine) {
        this.stateEntity = stateEntity;
        this.stateEntity.server.addService(proto.Election.service, {vote: this.voteWrapper()});
    }

    requestVote(target) {
        const s = this.stateEntity;
        const client = new proto.Election(`${target.host}:${target.port}`, grpc.credentials.createInsecure());
        client.vote({
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
            this.stateEntity.emit('voted');
        })
    }

    voteWrapper() {
        const self = this;
        return function vote(call, callback) {
            const s = self.stateEntity;
            const req = call.request;
            if (s.currentTerm > req.term ||
                s.votedFor != null ||
                0) {
                callback(null, { term: s.currentTerm, granted: false });
            }
            s.votedFor = req.candidateId;
            s.resetTimer();
            callback(null, { term: s.currentTerm, granted: true });
        }
    }
}

export default Election;
