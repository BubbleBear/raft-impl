"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grpc = require("grpc");
const proto_route_1 = require("../proto_route");
const proto = grpc.load(proto_route_1.default('election.proto')).raft;
class Election {
    constructor(stateEntity) {
        this.stateEntity = stateEntity;
    }
    requestVote(target) {
        const client = new proto.Election(`${target.host}:${target.port}`, grpc.credentials.createInsecure());
        if (true) {
            client.vote({
                term: this.stateEntity.currentTerm,
                candidateId: this.stateEntity.id,
                lastLogIndex: this.stateEntity.commitIndex,
                lastLogTerm: this.stateEntity // not sure
            }, (err, res) => {
                ;
            });
        }
    }
}
exports.default = Election;
