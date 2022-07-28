import Energy from 'lib/Energy';
import Bandwidth from 'lib/Bandwidth';
import Witness from 'lib/Witness';
import Apis from 'utils/Apis';

export default class TronStation {

    constructor(tronWeb = false) {
        if (!tronWeb)
            throw new Error('Expected instance of TronWeb');

        if (!tronWeb.defaultAddress)
            throw new Error('Expected default account set up in TronWeb');
        this.tronWeb = tronWeb;
        this.energy = new Energy(this);
        this.defaultAddress = tronWeb.defaultAddress;
        this.bp = new Bandwidth(this);
        this.witness = new Witness(this);
        this.apis = new Apis(this);
    }

    setTronWeb(tronWeb = false) {
        if (!tronWeb)
            throw new Error('Expected instance of TronWeb');
        if (!tronWeb.defaultAddress)
            throw new Error('Expected default account set up in TronWeb');
        this.tronWeb = tronWeb;
        this.defaultAddress = tronWeb.defaultAddress;
        this.energy = new Energy(this);
        this.defaultAddress = tronWeb.defaultAddress;
        this.bp = new Bandwidth(this);
        this.witness = new Witness(this);
        this.apis = new Apis(this);
    }

}
