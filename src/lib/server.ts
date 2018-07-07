import * as net from 'net';
import { Log } from "./log";
import { EADDRINUSE } from 'constants';

export class Server {
    id: number | string;

    private currentTerm: number = 0;

    private votedFor: string | undefined | null;

    private leaderId: string | undefined | null;

    private log: Log = new Log;

    private server: net.Server = net.createServer();

    constructor(id: number | string) {
        this.id = id;

        this.listen();
    }

    private listen(port: number = 5555) {
        this.server
        .on('listening', onListening)
        .on('error', (e) => {
            if ((<any>e).code === 'EADDRINUSE') {
                console.log(`port ${port} in use, trying port: ${port + 1}`);
                this.server.removeListener('listening', onListening);
                this.listen(port + 1);
            }
        })
        .listen({ port });

        function onListening() {
            console.log(`listening on: ${port}`);
        }
    }
}
