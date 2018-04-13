"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grpc = require("grpc");
const proto_route_1 = require("../proto_route");
const proto = grpc.load(proto_route_1.default('election.proto')).raft;
class Election {
    constructor(stateEntity) {
        this.stateEntity = stateEntity;
        this.stateEntity.server.addService(proto.Election.service, { vote: this.voteWrapper() });
    }
    requestVote(target) {
        const s = this.stateEntity;
        const client = new proto.Election(`${target.host}:${target.port}`, grpc.credentials.createInsecure());
        if (true) {
            client.vote({
                term: s.currentTerm,
                candidateId: s.id,
            }, (err, res) => {
                err && console.log(err) || console.log(res);
            });
        }
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
            callback(null, { term: s.currentTerm, granted: true });
        };
    }
}
exports.default = Election;
