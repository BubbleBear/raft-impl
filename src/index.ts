import { Server } from './lib/server';

let server = new Server(0);

async function start () {
    server = await server.listen(Number(process.argv[2]) || 5555);
    const res = await server.remoteAppendEntries({ port: process.argv[3] });
    console.log(res)
}

start();
