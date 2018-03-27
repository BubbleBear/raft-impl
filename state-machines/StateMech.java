enum State {
    FOLLOWER(0), CANDIDATE(1), LEADER(2);

    private int code;

    Role(int code) {
        this.code = code;
    }
}

public class StateMech {
    // unique identifier
    public Integer id;

    // current machine role
    public State state = State.FOLLOWER;

    /*
    * latest term server has seen (initialized to 0
    * on first boot, increases monotonically)
    */
    public Integer currentTerm = 0;

    /*
    * log entries; each entry contains command
    * for state machine, and term when entry
    * was received by leader (first index is 1)
    */
    public Integer[] log;

    /*
    * index of highest log entry known to be
    * committed (initialized to 0, increases
    * monotonically)
    */
    public volatile Integer commitIndex = 0;

    /*
    * index of highest log entry applied to state
    * machine (initialized to 0, increases
    * monotonically)
    */
    public volatile Integer lastApplied = 0;

    public elect() {
        currentTerm++;
        state = State.CANDIDATE;
        voteFor = id;
        // RPC, better to be asynchronized
    }

    public lead() {
        state = State.LEADER;
        voteFor = null;
    }

    public follow() {
        state = State.FOLLOWER;
        voteFor = null;
    }
}