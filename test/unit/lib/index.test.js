const {assert, assertThrow, tronStationBuilder, net, } = require('../../helpers/includes')
const TronWeb = require('tronweb');


describe('#index functional unit test', function () {

    let tronStation;

    before(async function () {
        this.timeout(10000);
        tronStation = tronStationBuilder.createInstance(net);
    });

    after(async function () {
        this.timeout(10000);
    });


    describe('#Reset tronweb', function () {
        this.timeout(10000);

        it('should reset tronWeb', async function () {
            let res = await tronStation.witness.getSrVoteRewardList();
            assert.equal(res.rewardList.length, 1);
            const newTronWeb = new TronWeb({
                fullHost: 'https://api.trongrid.io',
                privateKey: 'your private key'
            });
            tronStation.setTronWeb(newTronWeb)
            res = await tronStation.witness.getSrVoteRewardList()
            assert.isTrue(res.rewardList.length >= 27);
        });

    });

})
