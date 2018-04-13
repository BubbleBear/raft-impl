const StateMachine = require('../built/state_machine/common').default;
const grpc = require('grpc');
const config = require('./config.json');

const s = new StateMachine();

s.config = config;
s.id = 0;

s.server.bind(`${s.config[s.id].host}:${s.config[s.id].port}`, grpc.ServerCredentials.createInsecure());
s.server.start();

s.campaign();
