import * as net from 'net';
import { Entry, Log } from "./log";
import { EADDRINUSE } from 'constants';

export class Server {
    id: number | string;

    private currentTerm: number = 0;

    private votedFor: number | string | undefined | null;

    private leaderId: number | string | undefined | null;

    private log: Log = new Log;

    private server: net.Server = net.createServer();

    constructor(id: number | string) {
        this.id = id;

        this.listen();
    }

    listen(port: number = 5555): void {
        const self: Server = this;

        self.server
        .on('listening', onListening)
        .on('error', onError)
        .listen({ port });

        function onListening() {
            console.log(`listening on: ${port}`);
        }

        function onError(e) {
            if ((<any>e).code === 'EADDRINUSE') {
                console.log(`port ${port} in use, trying port: ${port + 1}`);
                self.server.removeListener('listening', onListening);
                self.server.removeListener('error', onError);
                self.listen(port + 1);
            }
        }
    }

    appendEntries(entries: Entry[]) {
        ;
    }

    requestVote(id: number | string) {
        ;
    }
}
