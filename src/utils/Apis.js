const _ = require("lodash");


export default class Apis {

    constructor(tronStation) {
        this.tronWeb = tronStation.tronWeb;
        this.utils = this.tronWeb.utils;
    }

    toTrx(amount) {
        return parseFloat(amount) / 10e5;
    }

    fromTrx(amount) {
        return amount * 10e5;
    }

    filterData(value) {
        return value === undefined ? 0 : value;
    }

    hexStringToBytes(str) {
        let pos = 0;
        let len = str.length;
        if (len % 2 !== 0) {
            return null;
        }
        len /= 2;
        let hexA = [];
        for (let i = 0; i < len; i++) {
            let s = str.substr(pos, 2);
            let v = parseInt(s, 16);
            hexA.push(v);
            pos += 2;
        }
        return hexA;
    }

    byteToString (arr) {
        if (typeof arr === "string") {
            return arr;
        }
        var str = "",
            _arr = arr;
        for (var i = 0; i < _arr.length; i++) {
            var one = _arr[i].toString(2),
                v = one.match(/^1+?(?=0)/);
            if (v && one.length === 8) {
                var bytesLength = v[0].length;
                var store = _arr[i].toString(2).slice(7 - bytesLength);
                for (var st = 1; st < bytesLength; st++) {
                    store += _arr[st + i].toString(2).slice(2);
                }
                str += String.fromCharCode(parseInt(store, 2));
                i += bytesLength - 1;
            } else {
                str += String.fromCharCode(_arr[i]);
            }
        }
        return str;
    }

    async getResourceByName(resource, address = this.tronWeb.defaultAddress.hex) {
        switch (resource) {
            case 'EnergyWeight': {
                resource = 'TotalEnergyWeight';
                break;
            }
            case 'BandwidthWeight': {
                resource = 'TotalNetWeight';
                break;
            }
            case 'BandwidthLimit': {
                resource = 'TotalNetLimit';
                break;
            }
            default:
                throw new Error('Invalid resource type provided.');
        };

        const resources = await this.getResourcesByName([resource], address);
        if (!resources || Object.keys(resources).length === 0)
            throw new Error('Get resource failed.')
        return resources[resource];
    }

    async getResourcesByName(resources, address = this.tronWeb.defaultAddress.hex) {
        if (!this.tronWeb.isAddress(address))
            throw new Error('Invalid address provides.')

        const accountResources = await this.tronWeb.trx.getAccountResources(address);
        if (!accountResources)
            throw new Error('Get resource failed.');

        let object = {};
        for (let i = 0; i < resources.length; i++) {
            object[resources[i]] = accountResources[resources[i]];
        }

        return object;
    }

    async getChainParameterByName(key) {
        const param = await this.getChainParametersByName([key]);
        if(!param)
            throw new Error('Get chain parameter failed.');
        return param[key];
    }

    async getChainParametersByName(keys) {
        const params = await this.tronWeb.trx.getChainParameters();

        let object = {};
        for (let i = 0; i < keys.length; i++) {
            const proposal = _.filter(params, ['key', keys[i]])[0];
            if (proposal) object[keys[i]] = proposal['value'];
        }

        return object;
    }

};