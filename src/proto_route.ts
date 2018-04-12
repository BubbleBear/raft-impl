import * as path from 'path';

const PROTO_BASE_PATH: string = path.resolve(__dirname, '../protos');

const route = function(proto): string {
    return path.resolve(PROTO_BASE_PATH, proto);
}

export default route;
