const {assert, assertThrow, tronStationBuilder, net, } = require('../../helpers/includes')
const TronWeb = require('tronweb');


describe('#apis functional unit test', function () {

    let tronStation;

    before(async function () {
        this.timeout(10000);
        tronStation = tronStationBuilder.createInstance(net);
    });

    after(async function () {
        this.timeout(10000);
    });


    describe('#from trx', function () {
        this.timeout(10000);

        it('should convert trx to sun', async function () {
            const res = await tronStation.apis.fromTrx(1);
            assert.equal(res, 10e5);
        });

    });

    describe('#getResourceByName', function () {
        this.timeout(10000);

        it('should get resource value by name', async function () {
            const res = await tronStation.apis.getResourceByName('EnergyWeight');
            assert.isTrue(typeof res === 'number' && res >= 0);
        });

    });

    describe('#getResourcesByName', function () {
        this.timeout(10000);

        it('should get resources by names', async function () {
            const res = await tronStation.apis.getResourcesByName(['TotalNetLimit', 'TotalNetWeight']);
            assert.isTrue(!!res.TotalNetLimit && !!res.TotalNetWeight);
        });

    });

    describe('#getChainParameterByName', function () {
        this.timeout(10000);

        it('should get proposal value by name', async function () {
            const res = await tronStation.apis.getChainParameterByName('getEnergyFee');
            assert.equal(res, 10);
        });

    });

    describe('#getChainParametersByName', function () {
        this.timeout(10000);

        it('should get proposals by names', async function () {
            const res = await tronStation.apis.getChainParametersByName(['getTotalEnergyLimit', 'getEnergyFee']);
            assert.isTrue(!!res.getTotalEnergyLimit && !!res.getEnergyFee);
        });

    });

})
