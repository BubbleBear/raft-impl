import * as net from 'net';
import { Entry, Log } from "./log";
import { EADDRINUSE } from 'constants';
import { Readable } from 'stream';

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

    private votes: number = 0;

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
                .on('connection', self.route.bind(self))
                .listen({ port });


            function onlistening() {
                console.log(`listening on: ${port}`);
                resolve(self);
            }

            function onerror(e) {
                if ((<any>e).code === 'EADDRINUSE') {
                    console.log(`port ${port} in use, trying port: ${port + 1}`);
                    self.server.removeAllListeners();
                    resolve(self.listen(port + 1));
                }
            }
        })
    }

    private async readAsync(ctx: Readable) {
        if (ctx instanceof Readable === false) {
            throw new Error('readAsync must be called with Readable Stream as context, please bind it with a stream or socket first');
        }

        ctx.isPaused() || ctx.pause();

        return new Promise((resolve, reject) => {
            ctx
                .removeListener('readable', onreadable)
                .removeListener('error', onerror)
                .once('readable', onreadable)
                .once('error', onerror)

            function onreadable() {
                resolve(ctx.read());
            }

            function onerror (e) {
                reject(e);
            }
        })
    }

    private async route(connection: net.Socket) {
        console.log('connection incoming')
        const methodName: string = <string>(await this.readAsync(connection)).toString();
        if (typeof this[methodName] === 'function') {
            connection.write(`invoking ${methodName}`);
            const args = <string>await this.readAsync(connection);
            const parsed = JSON.parse(args);
            connection.write(JSON.stringify(this[methodName](parsed)));
        }
        connection.end();
    }

    private async connect(port: number): Promise<net.Socket> {
        const self = this;

        return new Promise((resolve: (value: net.Socket | PromiseLike<net.Socket>) => void, reject) => {
            const socket: net.Socket = net.connect({ port: port });
            socket
                .on('connect', () => {
                    console.log('connected')
                    resolve(socket) })
                .on('error', onerror);

            function onerror(e) {
                setTimeout(() => {
                    console.log(e.message, 'reconnecting...')
                    resolve(self.connect(port));
                }, 500)
            }
        })
    }

    private async callRemote(options, fnName, args = null) {
        const socket = await this.connect((<any>options).port);
        socket.write(fnName);
        const recv = (await this.readAsync(socket)).toString();
        let res: any = false;
        if (recv == `invoking ${fnName}`) {
            socket.write(JSON.stringify(args));
            res = await this.readAsync(socket);
        }
        socket.end();
        return JSON.parse(res);
    }

    remoteAppendEntries(options, args?: appendEntriesArg) {
        return this.callRemote(options, 'appendEntries', args)
    }

    private appendEntries(args?: appendEntriesArg): boolean {
        if (!args) return true;
        if (args.term < this.currentTerm) return false;
    }

    remoteRequestVote(options, args: requestVoteArg) {
        {
            const granted = this.callRemote(options, 'requestVote', args);
            granted && this.votes++;
        }
    }

    private requestVote(args: requestVoteArg) {
        if (args.term < this.currentTerm) return false;
        if (
            (this.votedFor === null || this.votedFor == args.candidateId)
            && args.lastLogIndex >= this.log.length() - 1
            && args.lastLogTerm >= this.log.last().term
        ) {
            return true;
        }
    }
}
