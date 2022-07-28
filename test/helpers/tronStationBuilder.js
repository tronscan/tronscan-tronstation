const TronWeb = require('tronweb');
const TronStation = require('../setup/TronStation-SDK');
const {SHASTA, LOCAL, NET} = require('./config');

const createInstance = net => {
    let node;
    switch (net) {
        case 'shasta':
            node = SHASTA;
            break;
        case 'local':
            node = LOCAL;
            break;
        default:
            throw new Error('has to choose net in config.js');
    };

    let tronWeb = new TronWeb({
        fullHost: node.HOST,
        privateKey: node.PRIVATE_KEY
    });
    return new TronStation(tronWeb);
}

let instance;

const getInstance = net => {
    if (!instance) {
        instance = createInstance(net);
    }
    return instance;
};

const getTestAccounts = async (block) => {
    const accounts = {
        b58: [],
        hex: [],
        pks: []
    }
    const tronStation = createInstance(NET);
    const tronWeb = tronStation.tronWeb;
    const accountsJson = await tronWeb.fullNode.request('/admin/accounts-json');
    accounts.pks = accountsJson.privateKeys;
    for (let i = 0; i < accounts.pks.length; i++) {
        let addr = tronWeb.address.fromPrivateKey(accounts.pks[i]);
        accounts.b58.push(addr);
        accounts.hex.push(tronWeb.address.toHex(addr));
    }
    return Promise.resolve(accounts);
}

module.exports = {
    createInstance,
    getInstance,
    getTestAccounts,
    TronStation
};

