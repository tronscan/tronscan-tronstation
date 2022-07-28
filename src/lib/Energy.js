import Base from './Base';

export default class Energy extends Base {

    constructor(tronStation) {
        super(tronStation);
        this.defaultTotalEnergyLimit = 10e10
    }

    async trx2FrozenEnergy(amount, options = {}) {

        this.validator.validateNumber({ n: 'amount', v: amount}, '>=', 0);

        if (options.unit === 'sun')
            amount = this.apis.toTrx(amount);

        let totalEnergyWeight = await this.apis.getResourceByName('EnergyWeight');
        let totalEnergyLimit = await this.apis.getChainParameterByName('getTotalEnergyLimit');
        return (amount * (totalEnergyLimit ? totalEnergyLimit : this.defaultTotalEnergyLimit)) / totalEnergyWeight;
    }

    async frozenEnergy2Trx(energy, options = {}) {

        this.validator.validateNumber({ n: 'energy', v: energy}, '>=', 0);

        let totalEnergyWeight = await this.apis.getResourceByName('EnergyWeight');
        let totalEnergyLimit = await this.apis.getChainParameterByName('getTotalEnergyLimit');
        let amount = (energy * totalEnergyWeight) / (totalEnergyLimit ? totalEnergyLimit : this.defaultTotalEnergyLimit);

        if (options.unit === 'sun') {
            amount = this.apis.fromTrx(amount);
        }
        return amount;
    }

    async trx2BurnedEnergy(amount, options = {}) {

        this.validator.validateNumber({ n: 'amount', v: amount}, '>=', 0);

        if (options.unit === 'sun')
            amount = this.apis.toTrx(amount);

        let energyFee = await this.apis.getChainParameterByName("getEnergyFee");
        return this.apis.fromTrx(amount) / energyFee;
    }

    async burnedEnergy2Trx(energy, options = {}) {

        this.validator.validateNumber({ n: 'energy', v: energy}, '>=', 0);

        let energyFee = await this.apis.getChainParameterByName("getEnergyFee");
        let amount = energy * this.apis.toTrx(energyFee);

        if (options.unit === 'sun') {
            amount = this.apis.fromTrx(amount);
        }
        return amount;
    }

    async getMaxEnergyLimit(address, feeLimit, options = {}) {

        this.validator.validateAddress(address);
        this.validator.validateNumber({ n: 'feeLimit', v: feeLimit}, '>=', 0);

        if (options.unit === 'sun') {
            this.apis.toTrx(feeLimit);
        }
        if (feeLimit > 1000) {
            throw new Error('Max fee limit has a max limit of 1000 trx.');
        }

        let account = await this.tronWeb.trx.getAccount(address);
        if (!account || Object.keys(account).length === 0) {
            throw new Error('Account not exists or not activated.');
        }
        if (account.balance === undefined) account.balance = 0;

        let params = await this.apis.getChainParametersByName(['getTotalEnergyLimit', 'getEnergyFee']);
        let totalEnergyLimit = this.apis.filterData(params.getTotalEnergyLimit);
        let energyFee = this.apis.filterData(params.getEnergyFee);

        let resources = await this.apis.getResourcesByName(['EnergyLimit', 'EnergyUsed', 'TotalEnergyWeight'], address);
        let energyLimit = this.apis.filterData(resources.EnergyLimit);
        let energyUsed = this.apis.filterData(resources.EnergyUsed);
        let totalEnergyWeight = this.apis.filterData(resources.TotalEnergyWeight);

        let ratio = totalEnergyLimit / totalEnergyWeight;
        let accountTrxEnergy = (account.balance / energyFee);
        let accountTotalEnergy = energyLimit + accountTrxEnergy - energyUsed;
        let feeLimitEnergy = (feeLimit * ratio);

        let maxEnergyLimit;
        if (energyLimit > feeLimitEnergy) {
            maxEnergyLimit = Math.min(accountTotalEnergy, feeLimitEnergy);
        } else {
            maxEnergyLimit = accountTotalEnergy;
        }

        return {
            accountEnergy: energyLimit,
            accountEnergyUsed: energyUsed,
            accountTrxEnergy: accountTrxEnergy,
            accountTotalEnergy: accountTotalEnergy,
            feeLimit: feeLimit,
            feeLimitEnergy: feeLimitEnergy,
            maxEnergyLimit: maxEnergyLimit
        }

    }
}
