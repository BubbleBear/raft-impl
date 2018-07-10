import { Server } from './lib/server';
import { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } from 'constants';

let server = new Server(0);

async function start () {
    server = await server.listen(Number(process.argv[2]) || 5555);
    const res = await server.remoteAppendEntries({ port: process.argv[3] } as any);
    console.log(res)
}

start();
