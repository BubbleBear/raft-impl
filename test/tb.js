const StateMachine = require('../built/state_machine/common').default;
const grpc = require('grpc');
const config = require('./config.json');

const s = new StateMachine();

s.config = config;
s.id = 2;

s.server.bind(`${s.config.hosts[s.id].host}:${s.config.hosts[s.id].port}`, grpc.ServerCredentials.createInsecure());
s.server.start();

// s.election.requestVote(s.config[0]);
