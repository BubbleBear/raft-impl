import CommonState from './common';

class LeaderState extends CommonState {
    nextIndex: Array<number> = [];

    matchIndex: Array<number> = [];

    heartbeat() {
        this.config.map((v) => {
            ;
        })
    }
}

export default LeaderState;
