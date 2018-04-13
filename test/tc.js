const StateMachine = require('../built/state_machine/common').default;
const config = require('./config.json');

const s = new StateMachine();

s.config = config;
s.id = 1;

s.election.requestVote(s.config[0]);
