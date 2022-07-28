## What is Tron Station SDK?

__[Tron Station SDK - Developer Document](https://developers.tron.network/docs/tron-station-intro)__

Tron Station SDK is a library for estimating Tron energy and bandwidth consumption based on Tron network. Developers can quickly review energy and bandwidth points information before deploying/triggering a smart contract or make a transaction.


## Compatibility
- Version built for Node.js v6 and above
- Version built for browsers with more than 0.25% market share

Tron Station SDK is also compatible with frontend frameworks such as:
- Angular 
- React
- Vue

You can also ship Tron Station SDK in a Chrome extension.

## Installation

__[Tron Station SDK - NPM Package](https://www.npmjs.com/package/tronstation)__


### NPM
```bash
> npm install tronstation
```

### Yarn
```bash
> yarn add tronstation
```

## Build Steps

If you'd like to download and build locally, please follow the steps below.
```bash
> git clone https://github.com/TRON-US/tronstation-sdk
> cd tronstation-sdk
> yarn install
> yarn build
> yarn test
```

## Usage

### Install [TronWeb](https://github.com/Tron-US/tronweb)

### NPM
```bash
> npm install tronweb
```

### Yarn
```bash
> yarn add tronweb
```

### Initialize TronWeb and create Tron Station SDK instance

```js
import TronStation from 'tronstation';
import TronWeb from 'tronweb';

const fullNode = new HttpProvider('https://api.trongrid.io');
const solidityNode = new HttpProvider('https://api.trongrid.io');
const eventServer = new HttpProvider('https://api.trongrid.io');

const privateKey = 'your private key';

const tronWeb = new TronWeb(
    fullNode,
    solidityNode,
    eventServer,
    privateKey
);

// Constructor params are the tronWeb object and specification on if the net type is on main net or test net/private net
const tronStation = new TronStation(tronWeb);

// If you want to reset or switch node net work, just try to re-config your tronWeb and reset in tronStation sdk.
const newTronWeb = new TronWeb(
    fullNode,
    solidityNode,
    eventServer,
    privateKey
);
tronStation.setTronWeb(tronWeb);
```
## APIs

TronStation-SDK provides three parts of calculators and some of utils can be used easily to estimate energy, bandwidth and super representatives data.
There are also some sample usages provided in test directory.

### Energy Calculators
```js
// 1. Converter between frozen energy and trx amount.
const res = await tronStation.energy.trx2FrozenEnergy(1);
const res = await tronStation.energy.trx2FrozenEnergy(10e5, { unit: 'sun' });

const res = await tronStation.energy.frozenEnergy2Trx(666.74484);
const res = await tronStation.energy.frozenEnergy2Trx(666.74484, { unit: 'sun' });

// 2. Converter between burned energy and trx amount.
const res = await tronStation.energy.trx2BurnedEnergy(1);
const res = await tronStation.energy.trx2BurnedEnergy(10e5, { unit: 'sun' });

const res = await tronStation.energy.burnedEnergy2Trx(10e4);
const res = await tronStation.energy.burnedEnergy2Trx(10e4, { unit: 'sun' });

// 3. Calculator of max energy limit for deploying or triggering contract.
const res = await tronStation.energy.getMaxEnergyLimit('your hex address', 1000);
```

### Bandwidth Calculators
```js
// 1. Converter between frozen bandwidth points and trx amount.
const res = await tronStation.bp.trx2FrozenBandwidth(1);
const res = await tronStation.bp.trx2FrozenBandwidth(10e5, { unit: 'sun' });

const res = await tronStation.bp.frozenBandwidth2Trx(7300.356788039041);
const res = await tronStation.bp.frozenBandwidth2Trx(7300.356788039041, { unit: 'sun' });

// 2. API for getting account bandwidth.
const res = await tronStation.bp.getAccountBandwidth('4165519569C1A1E81646902142DD56A791DEBCB0D8');
```

### Super Representatives Calculators
```js
// 1. Calculator for estimating rank and votes reward by votes amount.
// existed SR/Candidate
const res = await tronStation.witness.calculateSrReward(1000, '41928c9af0651632157ef27a2cf17ca72c575a4d21');
// New SR/Candidate
const res = await tronStation.witness.calculateSrReward(1000);

// 2. API for getting current SR reward list.
const res = await tronStation.witness.getSrVoteRewardList();
```

### Other tools
```js
// 1. Convert between trx and sun.
const res = await tronStation.apis.fromTrx(1);
const res = await tronStation.apis.toTrx(10e5);

// 2. Get account resource by name.
const res = await tronStation.apis.getResourceByName('EnergyWeight');
const res = await tronStation.apis.getResourcesByName(['TotalNetLimit', 'TotalNetWeight']);

// 3. Get proposals by name.
const res = await tronStation.apis.getChainParameterByName('getEnergyFee');
const res = await tronStation.apis.getChainParametersByName(['getTotalEnergyLimit', 'getEnergyFee']);
```