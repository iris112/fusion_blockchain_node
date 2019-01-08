"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Web3 = require("web3");
const web3FusionExtend = require("web3-fusion-extend");
const WebSocket = require("websocket");
const dotenv = require("dotenv");
const child_process_1 = require("child_process");
dotenv.config();
const ws_server = 'ws://node.fusionnetwork.io/primus/?_primuscb=1546917854134-0';
var wb = new Web3();
var web3 = web3FusionExtend.extend(wb);
var client = new WebSocket.client();
var latestBlockNumber = 0;
var nodes = process.env.NODE_ID.split(',');
client.on('connectFailed', function (error) {
    console.log('Connect Error: ' + error.toString());
    client.connect(ws_server, 'get_latest_block');
});
client.on('connect', function (connection) {
    console.log('WebSocket Client Connected');
    connection.on('error', function (error) {
        console.log("Connection Error: " + error.toString());
        client.connect(ws_server, 'get_latest_block');
    });
    connection.on('close', function () {
        console.log('Connection Closed');
        client.connect(ws_server, 'get_latest_block');
    });
    connection.on('message', function (message) {
        try {
            var data = JSON.parse(message.utf8Data);
            if (data.action !== 'block')
                return;
            var blockNumber = data.data.block.number;
            if (latestBlockNumber < blockNumber)
                latestBlockNumber = blockNumber;
            nodes.forEach(node => {
                if (data.data.id === node.trim()) {
                    if (latestBlockNumber - blockNumber >= 10) {
                        console.log('Restarting node!!!');
                        const restartSh = child_process_1.spawn('sh', [process.env.SCRIPT_FILE], {
                            cwd: process.env.SCRIPT_PATH,
                            env: Object.assign({}, process.env, { PATH: process.env.PATH + ':/usr/local/bin' })
                        });
                        restartSh.stdout.on('data', (data) => {
                            console.log(data.toString());
                        });
                    }
                }
            });
        }
        catch (e) {
            console.log('This doesn\'t look like a valid JSON: ', message.data);
            return;
        }
    });
});
client.connect(ws_server, 'get_latest_block');
function connectService() {
    return __awaiter(this, void 0, void 0, function* () {
        let provider;
        try {
            provider = new web3.providers.WebsocketProvider("wss://gateway.fusionnetwork.io:10001", {
                timeout: 10000
            });
            web3.setProvider(provider);
            const block = yield web3.eth.getBlock("latest");
            console.log(block.number);
        }
        catch (e) {
            console.log("Provider has a problem trying again in 10 seconds or check connect argument");
            setTimeout(connectService, 1000);
        }
    });
}
;
