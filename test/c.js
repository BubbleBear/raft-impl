const PROTO_PATH = __dirname + '/protos/t.proto';
const grpc = require('grpc');
const proto = grpc.load(PROTO_PATH);

const client = new proto.Test('0.0.0.0:7777', grpc.credentials.createInsecure());

client.test({payload: 'asdf'}, (err, res) => {
    err && console.log(err) || console.log(res);
})
