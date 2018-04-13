const StateMachine = require('../built/state_machine/common').default;
const grpc = require('grpc');

const s = new StateMachine();

s.id = 0;

s.server.bind('0.0.0.0:8888', grpc.ServerCredentials.createInsecure());
s.server.start();
