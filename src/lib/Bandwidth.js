import Base from './Base';

export default class Bandwidth extends Base {

    constructor(tronStation) {
        super(tronStation);
    }

    async trx2FrozenBandwidth(amount, options = {}) {

        this.validator.validateNumber({ n: 'amount', v: amount}, '>=', 0);

        if (options.unit === 'sun')
            amount = this.apis.toTrx(amount);

        let accountResources = await this.apis.getResourcesByName(['TotalNetLimit', 'TotalNetWeight']);
        let totalBandwidthLimit = this.apis.filterData(accountResources.TotalNetLimit);
        let totalBandwidthWeight = accountResources.TotalNetWeight;
        return (amount * totalBandwidthLimit) / totalBandwidthWeight;
    }

    async frozenBandwidth2Trx(bandwidth, options = {}) {

        this.validator.validateNumber({ n: 'bandwidth', v: bandwidth}, '>=', 0);

        let accountResources = await this.apis.getResourcesByName(['TotalNetLimit', 'TotalNetWeight']);
        let totalBandwidthLimit = this.apis.filterData(accountResources.TotalNetLimit);
        let totalBandwidthWeight = accountResources.TotalNetWeight;
        let amount = (bandwidth * totalBandwidthWeight) / totalBandwidthLimit;

        if (options.unit === 'sun') {
            amount = this.apis.fromTrx(amount);
        }
        return amount;
    }

    async getAccountBandwidth(address, options = {}) {

        this.validator.validateAddress(address)

        let account = await this.tronWeb.trx.getAccount(address);
        if (account.balance === undefined) account.balance = 0;

        let resources = ["freeNetLimit", "freeNetUsed", "NetLimit", "NetUsed"];
        let accountResources = await this.apis.getResourcesByName(resources, address);

        let balance = this.apis.filterData(account.balance);
        let freebp = this.apis.filterData(accountResources.freeNetLimit);
        let freebpUsed = this.apis.filterData(accountResources.freeNetUsed);
        let accountbp = this.apis.filterData(accountResources.NetLimit);
        let accountbpUsed = this.apis.filterData(accountResources.NetUsed);
        let totalbp = freebp + accountbp - freebpUsed - accountbpUsed;

        return {
            balance: balance,
            freebp: freebp,
            freebpUsed: freebpUsed,
            accountbp: accountbp,
            accountbpUsed: accountbpUsed,
            totalbp: totalbp
        }
    }

}
