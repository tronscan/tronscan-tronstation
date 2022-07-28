import TronStation from '../index';
import Validator from '../utils/Validator';
import Apis from '../utils/Apis';

class Base {

    constructor(tronStation) {
        if (!tronStation || !(tronStation instanceof TronStation))
            throw new Error('Expected instance of TronStation');

        this.tronStation = tronStation;
        this.tronWeb = tronStation.tronWeb;
        this.apis = new Apis(this.tronStation);
        this.validator = new Validator(this.tronStation);
        this.utils = this.tronWeb.utils;
    }

}

export default Base
