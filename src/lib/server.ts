import * as net from 'net';
import { Entry, Log } from "./log";
import { EADDRINUSE } from 'constants';

export interface requestVoteArg {
    term: number;
    candidateId: number | string;
    lastLogIndex: number;
    lastLogTerm: number;
}

export interface appendEntriesArg {
    term: number;
    leaderId: number | string;
    prevLogIndex: number;
    entries: Entry[] | null;
    leaderCommitIndex: number;
}

export class Server {
    id: number | string;

    private currentTerm: number = 0;

    private votedFor: number | string | null;

    private leaderId: number | string | null;

    private log: Log = new Log;

    private server: net.Server = net.createServer({ pauseOnConnect: true });

    constructor(id: number | string) {
        this.id = id;

        // this.listen();
    }

    async listen(port: number = 5555): Promise<any> {
        const self: Server = this;

        return new Promise((resolve, reject) => {
            self.server
                .on('listening', onlistening)
                .on('error', onerror)
                .on('connection', self.route)
                .listen({ port });


            function onlistening() {
                console.log(`listening on: ${port}`);
                resolve(self);
            }

            function onerror(e) {
                if ((<any>e).code === 'EADDRINUSE') {
                    console.log(`port ${port} in use, trying port: ${port + 1}`);
                    self.server.removeAllListeners();
                    self.listen(port + 1);
                }
            }
        })
    }

    private route(connection: net.Socket) {
        const methodName: string = connection.read();
        if (typeof this[methodName] === 'function') {
            connection.write(`invoking ${methodName}`);
            const args = connection.read();
            const parsed = JSON.parse(args);
            connection.write(this[methodName](parsed));
        }
        connection.end();
    }

    appendEntries(arg: appendEntriesArg) {
        console.log('appending entries')
    }

    onAppendEntries(arg: appendEntriesArg) { }

    requestVote(arg: requestVoteArg) {
        const connection: net.Socket = net.connect({ port: 5556 });
    }

    onRequestVote(arg: requestVoteArg) { }
}
