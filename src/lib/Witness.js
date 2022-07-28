import Base from './Base';
const _ = require("lodash");

export default class Witness extends Base {

    constructor(tronStation) {
        super(tronStation);
    }

    async getSrVoteRewardList() {

        const srs = await this.tronWeb.trx.listSuperRepresentatives();
        let data = [];
        let rewardList = [];
        let totalVotes = _.sumBy(srs, sr => {
            return sr.voteCount;
        });

        let totalVoteReward = 16 * 20 * 60 * 24;
        let totalBlockReward = 2 * totalVoteReward;
        let isMainNet = this.tronWeb.fullNode.host === 'https://api.trongrid.io';
        let srAmount = isMainNet ? 27 : srs.length;

        await Promise.all(
            srs.map(async sr => {
                let object = {};
                const account = await this.tronWeb.trx.getAccount(sr.address);
                object.rank = 0;
                if (account.account_name !== undefined) {
                    object.name = this.tronWeb.utils.bytes.bytesToString(this.apis.hexStringToBytes(account.account_name));
                } else {
                    object.name = sr.url;
                }

                object.url = sr.url;
                object.address = sr.address;
                object.votes = this.apis.filterData(sr.voteCount);
                object.percentage = (100 * (object.votes / totalVotes));
                object.role = "";
                object.voteReward = Math.ceil(totalVoteReward * (object.votes / totalVotes));
                object.blockReward = Math.ceil(totalBlockReward / srAmount);
                object.totalReward = object.voteReward + object.blockReward;
                data.push(object);
            })
        );

        data = _.sortBy(data, d => {
            return d.votes * -1;
        });

        data.map((sr, index) => {
            if (index < 27) {
                sr.rank = index + 1;
                sr.role = 'sr';
                rewardList.push(sr);
            } else {
                sr.blockReward = 0;
                sr.totalReward = sr.voteReward;
                sr.rank = index + 1;
                sr.role = 'candidate';
                rewardList.push(sr);
            }
        });

        return {
            totalVotes: totalVotes,
            rewardList: rewardList
        };
    }

    async calculateSrReward(addedVotes, srAddress) {

        this.validator.validateNumber({ n: 'addedVotes', v: addedVotes}, '>=', 0);
        if (srAddress)
            this.validator.validateAddress(srAddress);

        let isMainNet = this.tronWeb.fullNode.host === 'https://api.trongrid.io';
        srAddress = this.tronWeb.address.toHex(srAddress);

        let res = await this.getSrVoteRewardList();
        let srs = res.rewardList;
        if (!srs || srs.length === 0) throw new Error("Error getting reward list");

        let existedSrArray = _.filter(srs, item => item.address === srAddress);
        let existedSr;
        if (existedSrArray && existedSrArray.length === 1)
            existedSr = existedSrArray[0];

        let totalSrVotes = (existedSr ? existedSr.votes : 0) + addedVotes;
        let ascSrs = _.reverse(srs);
        let pos = _.sortedIndexBy(ascSrs, { votes: totalSrVotes }, (d) => { return d.votes; });
        let rank = addedVotes === 0
            ? srs.length - pos
            : srs.length - pos + 1;
        let srName = existedSr
            ? existedSr.name
            : rank <= 27
                ? 'New SR'
                : 'New Candidate';
        let totalVotes = res.totalVotes + addedVotes;
        let percentage = (100 * totalSrVotes) / totalVotes;
        let voteReward = Math.ceil(16 * 20 * 60 * 24 * (totalSrVotes / totalVotes));
        let srsLength = isMainNet ? 27 : srs.length;
        let blockReward =
            rank <= srsLength
                ? Math.ceil((32 * 20 * 60 * 24) / srsLength)
                : 0;
        let totalReward = blockReward + voteReward;

        return {
            rank: rank,
            sr: srName,
            votes: totalSrVotes,
            totalVotes: totalVotes,
            percentage: percentage,
            voteReward: voteReward,
            blockReward: blockReward,
            totalReward: totalReward
        };

    }

}
