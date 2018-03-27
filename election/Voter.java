import java.rmi.*;

class Voter {
    /*
    * candidateId that received vote in current
    * term (or null if none)
    */
    public Integer voteFor = null;

    public Boolean vote(candidateId) {
        if (voteFor == null) {
            voteFor = candidateId;
            return true;
        }
        return false;
    }
}
