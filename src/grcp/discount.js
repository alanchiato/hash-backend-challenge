const path = require('path');
const PROTO_PATH = path.resolve(__dirname, '../grcp/discount.proto');
const GRPCClient = require('node-grpc-client');

const myClient = new GRPCClient(PROTO_PATH, process.env.GRCP_PACK_SERVICE, process.env.GRCP_SERVICE, `${process.env.GRCP_HOST}:${process.env.GRCP_PORT}`);

module.exports = { myClient };