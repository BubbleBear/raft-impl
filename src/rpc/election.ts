import * as grpc from 'grpc';
import protoRoute from '../proto_route';
import stateMachine from '../state_machine/common';
const proto = grpc.load(protoRoute('election.proto')).raft;

class Election {
    stateEntity: stateMachine;

    constructor(stateEntity: stateMachine) {
        this.stateEntity = stateEntity;
    }

    requestVote(target) {
        const client = new proto.Election(`${target.host}:${target.port}`, grpc.credentials.createInsecure());
        if (true) {
            let s = this.stateEntity;
            client.vote({
                term: s.currentTerm,
                candidateId: s.id,
                lastLogIndex: s.log.length - 1,    // not sure
                lastLogTerm: s.log[s.log.length - 1].term      // not sure
            }, (err, res) => {
                err && console.log(err) || console.log(res);
            })
        }
    }
}

export default Election;
