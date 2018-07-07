import { Server } from './lib/server';

const server = new Server(0);

server.listen(Number(process.argv[2]) || 5555)
.then((s: Server) => s.appendEntries({} as any));
