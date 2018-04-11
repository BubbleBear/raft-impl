const PROTO_PATH = __dirname + '/protos/t.proto';
const grpc = require('grpc');
const proto = grpc.load(PROTO_PATH);

function test(fn, cb) {
    cb(null, {payload: 'hi ' + fn.request.payload});
}

const server = new grpc.Server();
server.addService(proto.Test.service, {test: test});
server.bind('0.0.0.0:7777', grpc.ServerCredentials.createInsecure());
server.start();
