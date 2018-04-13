const StateMachine = require('../built/state_machine/common').default;

const s = new StateMachine();

const target = {
    host: '0.0.0.0',
    port: '8888'
}

s.id = 1;

s.election.requestVote(target);
