/*!
 * network.js - bitcoin networks for bcoin
 * Copyright (c) 2014-2015, Fedor Indutny (MIT License)
 * Copyright (c) 2014-2017, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bcoin
 */

'use strict';

/**
 * @module protocol/networks
 */

var BN = require('bn.js');

var network = exports;
var main, testnet, regtest, segnet4, simnet;

/**
 * Network type list.
 * @memberof module:protocol/networks
 * @const {String[]}
 * @default
 */

network.types = ['main', 'testnet', 'regtest', 'segnet4', 'simnet'];

/**
 * Mainnet
 * @static
 * @lends module:protocol/networks
 * @type {Object}
 */

main = network.main = {};

/**
 * Symbolic network type.
 * @const {String}
 * @default
 */

main.type = 'main';

/**
 * Default DNS seeds.
 * @const {String[]}
 * @default
 */

main.seeds = [
  'seed.bitcoin.sipa.be', // Pieter Wuille
  'dnsseed.bluematt.me', // Matt Corallo
  'dnsseed.bitcoin.dashjr.org', // Luke Dashjr
  'seed.bitcoinstats.com', // Christian Decker
  'seed.bitcoin.jonasschnelli.ch', // Jonas Schnelli
  'seed.btc.petertodd.org' // Peter Todd
];

/**
 * Packet magic number.
 * @const {Number}
 * @default
 */

main.magic = 0xd9b4bef9;

/**
 * Default network port.
 * @const {Number}
 * @default
 */

main.port = 8333;

/**
 * Checkpoint block list.
 * @const {Object}
 */

main.checkpointMap = {
  450000: '0ba2070c62cd9da1f8cef88a0648c661a411d33e728340010000000000000000'
};

/**
 * Last checkpoint height.
 * @const {Number}
 * @default
 */

main.lastCheckpoint = 420000;

/**
 * @const {Number}
 * @default
 */

main.halvingInterval = 210000;

/**
 * Genesis block header.
 * @const {NakedBlock}
 */

main.genesis = {
  version: 0x20000000,
  hash: '41cd7e7d73a8c153db34f6b046ad6ca4472f2227f25f77020000000000000000',
  prevBlock: '  000000000000000002424db0163641940c9fd999ec897b412ce64e36d6ab7650',
  merkleRoot: '29d000eee85f08b6482026be2d92d081d6f9418346e6b2e9fe2e9b985f24ed1e',
  ts: 1482001679,
  bits: 402885509,
  nonce: 3814348197,
  height: 443870
};

/**
 * The network's genesis block in a hex string.
 * @const {String}
 */

main.genesisBlock =
  '000000205076abd6364ee62c417b89ec99d99f0c94413616b04d420200000000000000001eed245f989b2efee9b2e6468341f9d681d0922dbe262048b6085fe8ee00d0290f8d5558858b0318a5555ae30901000000010000000000000000000000000000000000000000000000000000000000000000ffffffff2b03dec5061e4d696e656420627920416e74506f6f6c206e6d30200d5f3c632058558d0f5d010000822a0900ffffffff013fe69a4a000000001976a9149338b976abdb1a5c8711ac57bb2417a98fdb8bac88ac00000000010000000183629871ebcc0ce8bfd1d9463fc7e906e1a3d17c909442bed54c10a599b53935000000006b483045022100ea916940af7b9b956a5bbca726a54648dd2cbc61de020f557a44cb42c3b8d3fd022051c95dc222576b841e4a689b1400527beba5b9128b68eb2c6f567808df4ef45601210382fd762515b68a938074a17d8a2aa054a60fb9594e2c92656a29244860dbf7c5fdffffff0100213815000000001976a914e4134970cfd81d2f09760e052c509edd3832354d88ac000000000100000001dcd3cb30c9095b43e1e0ef14a8d92e39e3def37990d5b796e7e4d6d5a9aa0b68000000008b483045022100a64563af097eda61191f8c5d04b4f48ce5f4224403ce86dab8e1703b8d0d656d02206ff5f3a1c4f2a51cb65897b51c87e6dd420c708bcc8e9906807fd83938e95878014104892e31d04537248c9461f9cf42f093f015624354dcf6e98f17ba582ef1bf17c3c727c4940cac221fe0a4d60b3954047fcc7c53e24bb9268e5a3de403247607d0ffffffff016887bd00000000001976a9146253907064ab8ff696b6fc38d0d4c53a7064363e88ac0000000001000000016caeada964430fda0dd5bb5b7f7864d2709f53b65bc05d5803d88aa4b364ead6010000006a473044022075059a1e6dafc616beb62317f09328554cc00dc8cfbf79edddf42c63d89dcf9e02204cccbf262592b93376d7d94a6eb86dd7c24fc302169c66c8f183121934998dd00121021550188976a00d6883d823a935fb15e1678517d8d71db526e41d09a56351121cffffffff0240334a01000000001976a914ae16c3fb72dabcc8c1603d47add1c6de9f7d4c9d88acd0e2a308000000001976a9142e677d8c175b3555f25e6c1cc7bf23c210a4ade088ac00000000010000000130b5db594ac7ff1c62a000349f3907e416242473f96f3229caf689350fc8a2a3010000006a473044022070d8874081b440da7b1a6fce4fddbf9fbcb5b4529c044f5d235f64223224f34102203c9045efdf3d1abff866a350c03e8294d1dd95e9b0b1dd11c2f9bedf86dfefcd012103baae35e46fed6924db07497b3a11dfb2028ddb1ab30e561963114bfbd3849313ffffffff0380010500000000001976a914c975e98ea45d63ff419cd94897c4bc60b334efc388acfa492100000000001976a914c43a1fcbfe0022052c37afbb69fcf76dd11303df88ac88d23d00000000001976a9141caca033c6ad56eb0941bc5dffdea1c6c7b2dcda88ac00000000010000000139158b7696236b6a41d19e022d5b12b0800144679e68263434f2bd355d9cca4d050000006a473044022060a1a0ec9e71e5d2067ceb07077d1e9538ee182d1aed4908a3d4bc876ab004f702206ff2563cfe2fbe7ffa86d09d76ff8777e7e4c8cee8a14109be3c61deac4662ee012102bd01d1f7cf5b781cf4894d3a9f9c85c1cafdcc90f62570b43ccb92c4901fdb3cffffffff03888a0100000000001976a914a0922377ff3ba2c4f1564c0241fed9bf24ba222388aca23f0a00000000001976a914c43a1fcbfe0022052c37afbb69fcf76dd11303df88ac76081300000000001976a914c0bb45a93519233df7353744465e47e3dda5f87e88ac00000000010000000160712d3f07af17f69b74436587c3caacebbb3e4edbe8b8cb06b6364eb943f24f000000006b483045022100a8b2be366bf2c74a8aeadea0df663dee20603ebcd96698c6e563034adf0310e202200eb9fc0298e34b55acc5314fec3ad12ca8da5baab10cda58a1a98701560a75a80121031f750a5708036cabea86fa9d4848772ab0d2551607f3cf6c60cd2ea4dd2e6646ffffffff02c0af1c00000000001976a91410cb8d3dc6b073c0b68d6f399e4944a0f4a1a84b88ac002d3101000000001976a9140a926ae8852a1a1f87edf524236d0956029f972288ac0000000001000000018fc9626ed20c7d943bc09cf64321b8afe2bf62870e288dbdfd77fc3d23f1eb37000000006b483045022100b8a687ed39edf5c537b898e01fa8a26c43bdae600885d34807dc891b25671923022020967a0882923edf733c99bc42cb715e43c867138124d173768393ec1507b137012102380d8c3e5ee697e56b2cfcd7479f29279d1c3e4eb891fbb2363968df13fecda7ffffffff0288780400000000001976a914bbb60aff24ce5e47c2ed9942bac2047f4aa387d588ac822bb023000000001976a9147969f540fd85c642a982503c98e78ed19fcd9d7488ac000000000100000001772b81e53948c0ca782ec341b9fba4824ad49555ac06483adadd305d097f6043010000006a47304402207bdf4ed2228617688682c1b480733159dcce41163f25c0ed9269b91d6269316802204ef2eafe7e750e954151927fc935c6364b3974ee817a7259d251049e0835e259012102af53530edccec22e28a0dabbfb7bea86783681ec0377aca3fd94d1d2ec1408a8ffffffff02d01b5000000000001976a9149ac529b8ae8f1444b0b470378f51e45ca4cc014388ac69741906000000001976a9140f1ab338ab6fed8a64d1bf875954c4df177019c788ac00000000';

/**
 * POW-related constants.
 * @enum {Number}
 * @default
 */

main.pow = {
  /**
   * Default target.
   * @const {BN}
   */

  limit: new BN(
    '00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
    'hex'
  ),

  /**
   * Compact pow limit.
   * @const {Number}
   * @default
   */

  bits: 486604799,

  /**
   * Minimum chainwork for best chain.
   * @const {BN}
   */

  chainwork: new BN(
    '00000000000000000000000000000000000000000045b494a5d30a82d9a52ff4',
    'hex'
  ),

  /**
   * Desired retarget period in seconds.
   * @const {Number}
   * @default
   */

  targetTimespan: 14 * 24 * 60 * 60,

  /**
   * Average block time.
   * @const {Number}
   * @default
   */

  targetSpacing: 10 * 60,

  /**
   * Retarget interval in blocks.
   * @const {Number}
   * @default
   */

  retargetInterval: 2016,

  /**
   * Whether to reset target if a block
   * has not been mined recently.
   * @const {Boolean}
   * @default
   */

  targetReset: false,

  /**
   * Do not allow retargetting.
   * @const {Boolean}
   * @default
   */

  noRetargeting: false
};

/**
 * Block constants.
 * @enum {Number}
 * @default
 */

main.block = {
  /**
   * Height at which bip34 was activated.
   * Used for avoiding bip30 checks.
   */

  bip34height: 227931,

  /**
   * Hash of the block that activated bip34.
   */

  bip34hash: 'b808089c756add1591b1d17bab44bba3fed9e02f942ab4894b02000000000000',

  /**
   * Height at which bip65 was activated.
   */

  bip65height: 388381,

  /**
   * Hash of the block that activated bip65.
   */

  bip65hash: 'f035476cfaeb9f677c2cdad00fd908c556775ded24b6c2040000000000000000',

  /**
   * Height at which bip66 was activated.
   */

  bip66height: 363725,

  /**
   * Hash of the block that activated bip66.
   */

  bip66hash: '3109b588941188a9f1c2576aae462d729b8cce9da1ea79030000000000000000',

  /**
   * Safe height to start pruning.
   */

  pruneAfterHeight: 1000,

  /**
   * Safe number of blocks to keep.
   */

  keepBlocks: 288,

  /**
   * Age used for the time delta to
   * determine whether the chain is synced.
   */

  maxTipAge: 24 * 60 * 60,

  /**
   * Height at which block processing is
   * slow enough that we can output
   * logs without spamming.
   */

  slowHeight: 325000
};

/**
 * Map of historical blocks which create duplicate transactions hashes.
 * @see https://github.com/bitcoin/bips/blob/master/bip-0030.mediawiki
 * @const {Object}
 * @default
 */

main.bip30 = {
  91842: 'eccae000e3c8e4e093936360431f3b7603c563c1ff6181390a4d0a0000000000',
  91880: '21d77ccb4c08386a04ac0196ae10f6a1d2c2a377558ca190f143070000000000'
};

/**
 * For versionbits.
 * @const {Number}
 * @default
 */

main.activationThreshold = 1916; // 95% of 2016

/**
 * Confirmation window for versionbits.
 * @const {Number}
 * @default
 */

main.minerWindow = 2016; // nPowTargetTimespan / nPowTargetSpacing

/**
 * Deployments for versionbits.
 * @const {Object}
 * @default
 */

main.deployments = {
  testdummy: {
    name: 'testdummy',
    bit: 28,
    startTime: 1199145601, // January 1, 2008
    timeout: 1230767999, // December 31, 2008
    force: true
  },
  csv: {
    name: 'csv',
    bit: 0,
    startTime: 1462060800, // May 1st, 2016
    timeout: 1493596800, // May 1st, 2017
    force: true
  },
  segwit: {
    name: 'segwit',
    bit: 1,
    startTime: 1479168000, // November 15th, 2016.
    timeout: 1510704000, // November 15th, 2017.
    force: false
  },
  mast: {
    name: 'mast',
    bit: 2,
    startTime: 0xffffffff, // Far in the future
    timeout: 0xffffffff,
    force: false
  }
};

/**
 * Deployments for versionbits (array form, sorted).
 * @const {Array}
 * @default
 */

main.deploys = [
  main.deployments.csv,
  main.deployments.segwit,
  main.deployments.mast,
  main.deployments.testdummy
];

/**
 * Key prefixes.
 * @enum {Number}
 * @default
 */

main.keyPrefix = {
  privkey: 0x80,
  xpubkey: 0x0488b21e,
  xprivkey: 0x0488ade4,
  xprivkey58: 'xprv',
  xpubkey58: 'xpub',
  coinType: 0
};

/**
 * {@link Address} prefixes.
 * @enum {Number}
 */

main.addressPrefix = {
  pubkeyhash: 0x00,
  scripthash: 0x05,
  witnesspubkeyhash: 0x06,
  witnessscripthash: 0x0a,
  bech32: 'bc'
};

/**
 * Default value for whether the mempool
 * accepts non-standard transactions.
 * @const {Boolean}
 * @default
 */

main.requireStandard = true;

/**
 * Default http port.
 * @const {Number}
 * @default
 */

main.rpcPort = 8332;

/**
 * Default min relay rate.
 * @const {Rate}
 * @default
 */

main.minRelay = 1000;

/**
 * Default normal relay rate.
 * @const {Rate}
 * @default
 */

main.feeRate = 100000;

/**
 * Maximum normal relay rate.
 * @const {Rate}
 * @default
 */

main.maxFeeRate = 400000;

/**
 * Whether to allow self-connection.
 * @const {Boolean}
 */

main.selfConnect = false;

/**
 * Whether to request mempool on sync.
 * @const {Boolean}
 */

main.requestMempool = false;

/*
 * Testnet (v3)
 * https://en.bitcoin.it/wiki/Testnet
 */

testnet = network.testnet = {};

testnet.type = 'testnet';

testnet.seeds = [
  'testnet-seed.bitcoin.jonasschnelli.ch', // Jonas Schnelli
  'seed.tbtc.petertodd.org', // Peter Todd
  'testnet-seed.bluematt.me', // Matt Corallo
  'testnet-seed.bitcoin.schildbach.de' // Andreas Schildbach
];

testnet.magic = 0x0709110b;

testnet.port = 18333;

testnet.checkpointMap = {
  546: '70cb6af7ebbcb1315d3414029c556c55f3e2fc353c4c9063a76c932a00000000',
  // Custom checkpoints
  10000: '02a1b43f52591e53b660069173ac83b675798e12599dbb0442b7580000000000',
  100000: '1e0a16bbadccde1d80c66597b1939e45f91b570d29f95fc158299e0000000000',
  170000: '508125560d202b89757889bb0e49c712477be20440058f05db4f0e0000000000',
  210000: '32365454b5f29a826bff8ad9b0448cad0072fc73d50e482d91a3dece00000000',
  300000: 'a141bf3972424853f04367b47995e220e0b5a2706e5618766f22000000000000',
  390000: 'f217e183484fb6d695609cc71fa2ae24c3020943407e0150b298030000000000',
  420000: 'de9e73a3b91fbb014e036e8583a17d6b638a699aeb2de8573d12580800000000',
  500000: '06f60922a2aab2757317820fc6ffaf6a470e2cbb0f63a2aac0a7010000000000',
  630000: 'bbbe117035432a6a4effcb297207a02b031735b43e0d19a9217c000000000000',
  700000: 'c14d3f6a1e7c7d66fd940951e44f3c3be1273bea4d2ab1786140000000000000',
  780000: '0381582e34c3755964dc2813e2b33e521e5596367144e1670851050000000000',
  840000: 'dac1648107bd4394e57e4083c86d42b548b1cfb119665f179ea80a0000000000',
  900000: '9bd8ac418beeb1a2cf5d68c8b5c6ebaa947a5b766e5524898d6f350000000000',
  1050000: 'd8190cf0af7f08e179cab51d67db0b44b87951a78f7fdc31b4a01a0000000000'
};

testnet.lastCheckpoint = 900000;

testnet.halvingInterval = 210000;

testnet.genesis = {
  version: 1,
  hash: '43497fd7f826957108f4a30fd9cec3aeba79972084e90ead01ea330900000000',
  prevBlock: '0000000000000000000000000000000000000000000000000000000000000000',
  merkleRoot: '3ba3edfd7a7b12b27ac72c3e67768f617fc81bc3888a51323a9fb8aa4b1e5e4a',
  ts: 1296688602,
  bits: 486604799,
  nonce: 414098458,
  height: 0
};

testnet.genesisBlock =
  '0100000000000000000000000000000000000000000000000000000000000000000000'
  + '003ba3edfd7a7b12b27ac72c3e67768f617fc81bc3888a51323a9fb8aa4b1e5e4adae5'
  + '494dffff001d1aa4ae1801010000000100000000000000000000000000000000000000'
  + '00000000000000000000000000ffffffff4d04ffff001d0104455468652054696d6573'
  + '2030332f4a616e2f32303039204368616e63656c6c6f72206f6e206272696e6b206f66'
  + '207365636f6e64206261696c6f757420666f722062616e6b73ffffffff0100f2052a01'
  + '000000434104678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f'
  + '61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5f'
  + 'ac00000000';

testnet.pow = {
  limit: new BN(
    '00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
    'hex'
  ),
  bits: 486604799,
  chainwork: new BN(
    '000000000000000000000000000000000000000000000020291512942d3765fe',
    'hex'
  ),
  targetTimespan: 14 * 24 * 60 * 60,
  targetSpacing: 10 * 60,
  retargetInterval: 2016,
  targetReset: true,
  noRetargeting: false
};

testnet.block = {
  bip34height: 21111,
  bip34hash: 'f88ecd9912d00d3f5c2a8e0f50417d3e415c75b3abe584346da9b32300000000',
  bip65height: 581885,
  bip65hash: 'b61e864fbec41dfaf09da05d1d76dc068b0dd82ee7982ff255667f0000000000',
  bip66height: 330776,
  bip66hash: '82a14b9e5ea81d4832b8e2cd3c2a6092b5a3853285a8995ec4c8042100000000',
  pruneAfterHeight: 1000,
  keepBlocks: 10000,
  maxTipAge: 24 * 60 * 60,
  slowHeight: 950000
};

testnet.bip30 = {};

testnet.activationThreshold = 1512; // 75% for testchains

testnet.minerWindow = 2016; // nPowTargetTimespan / nPowTargetSpacing

testnet.deployments = {
  testdummy: {
    name: 'testdummy',
    bit: 28,
    startTime: 1199145601, // January 1, 2008
    timeout: 1230767999, // December 31, 2008
    force: true
  },
  csv: {
    name: 'csv',
    bit: 0,
    startTime: 1456790400, // March 1st, 2016
    timeout: 1493596800, // May 1st, 2017
    force: true
  },
  segwit: {
    name: 'segwit',
    bit: 1,
    startTime: 1462060800, // May 1st 2016
    timeout: 1493596800, // May 1st 2017
    force: false
  },
  mast: {
    name: 'mast',
    bit: 2,
    startTime: 0xffffffff, // Far in the future
    timeout: 0xffffffff,
    force: false
  }
};

testnet.deploys = [
  testnet.deployments.csv,
  testnet.deployments.segwit,
  testnet.deployments.mast,
  testnet.deployments.testdummy
];

testnet.keyPrefix = {
  privkey: 0xef,
  xpubkey: 0x043587cf,
  xprivkey: 0x04358394,
  xprivkey58: 'tprv',
  xpubkey58: 'tpub',
  coinType: 1
};

testnet.addressPrefix = {
  pubkeyhash: 0x6f,
  scripthash: 0xc4,
  witnesspubkeyhash: 0x03,
  witnessscripthash: 0x28,
  bech32: 'tb'
};

testnet.requireStandard = false;

testnet.rpcPort = 18332;

testnet.minRelay = 1000;

testnet.feeRate = 20000;

testnet.maxFeeRate = 60000;

testnet.selfConnect = false;

testnet.requestMempool = false;

/*
 * Regtest
 */

regtest = network.regtest = {};

regtest.type = 'regtest';

regtest.seeds = [
  '127.0.0.1'
];

regtest.magic = 0xdab5bffa;

regtest.port = 48444;

regtest.checkpointMap = {};
regtest.lastCheckpoint = 0;

regtest.halvingInterval = 150;

regtest.genesis = {
  version: 1,
  hash: '06226e46111a0b59caaf126043eb5bbf28c34f3a5e332a1fc7b2b73cf188910f',
  prevBlock: '0000000000000000000000000000000000000000000000000000000000000000',
  merkleRoot: '3ba3edfd7a7b12b27ac72c3e67768f617fc81bc3888a51323a9fb8aa4b1e5e4a',
  ts: 1296688602,
  bits: 545259519,
  nonce: 2,
  height: 0
};

regtest.genesisBlock =
  '0100000000000000000000000000000000000000000000000000000000000000000000'
  + '003ba3edfd7a7b12b27ac72c3e67768f617fc81bc3888a51323a9fb8aa4b1e5e4adae5'
  + '494dffff7f200200000001010000000100000000000000000000000000000000000000'
  + '00000000000000000000000000ffffffff4d04ffff001d0104455468652054696d6573'
  + '2030332f4a616e2f32303039204368616e63656c6c6f72206f6e206272696e6b206f66'
  + '207365636f6e64206261696c6f757420666f722062616e6b73ffffffff0100f2052a01'
  + '000000434104678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f'
  + '61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5f'
  + 'ac00000000';

regtest.pow = {
  limit: new BN(
    '7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
    'hex'
  ),
  bits: 545259519,
  chainwork: new BN(
    '0000000000000000000000000000000000000000000000000000000000000002',
    'hex'
  ),
  targetTimespan: 14 * 24 * 60 * 60,
  targetSpacing: 10 * 60,
  retargetInterval: 2016,
  targetReset: true,
  noRetargeting: true
};

regtest.block = {
  bip34height: 100000000,
  bip34hash: null,
  bip65height: 1351,
  bip65hash: null,
  bip66height: 1251,
  bip66hash: null,
  pruneAfterHeight: 1000,
  keepBlocks: 10000,
  maxTipAge: 0xffffffff,
  slowHeight: 0
};

regtest.bip30 = {};

regtest.activationThreshold = 108; // 75% for testchains

regtest.minerWindow = 144; // Faster than normal for regtest (144 instead of 2016)

regtest.deployments = {
  testdummy: {
    name: 'testdummy',
    bit: 28,
    startTime: 0,
    timeout: 0xffffffff,
    force: true
  },
  csv: {
    name: 'csv',
    bit: 0,
    startTime: 0,
    timeout: 0xffffffff,
    force: true
  },
  segwit: {
    name: 'segwit',
    bit: 1,
    startTime: 0,
    timeout: 0xffffffff,
    force: false
  },
  mast: {
    name: 'mast',
    bit: 2,
    startTime: 0xffffffff, // Far in the future
    timeout: 0xffffffff,
    force: false
  }
};

regtest.deploys = [
  regtest.deployments.csv,
  regtest.deployments.segwit,
  regtest.deployments.mast,
  regtest.deployments.testdummy
];

regtest.keyPrefix = {
  privkey: 0xef,
  xpubkey: 0x043587cf,
  xprivkey: 0x04358394,
  xprivkey58: 'tprv',
  xpubkey58: 'tpub',
  coinType: 1
};

regtest.addressPrefix = {
  pubkeyhash: 0x6f,
  scripthash: 0xc4,
  witnesspubkeyhash: 0x03,
  witnessscripthash: 0x28,
  bech32: 'tb'
};

regtest.requireStandard = false;

regtest.rpcPort = 48332;

regtest.minRelay = 1000;

regtest.feeRate = 20000;

regtest.maxFeeRate = 60000;

regtest.selfConnect = true;

regtest.requestMempool = true;

/*
 * segnet4
 */

segnet4 = network.segnet4 = {};

segnet4.type = 'segnet4';

segnet4.seeds = [
  '104.243.38.34',
  '37.34.48.17'
];

segnet4.magic = 0xc4a1abdc;

segnet4.port = 28901;

segnet4.checkpointMap = {};
segnet4.lastCheckpoint = 0;

segnet4.halvingInterval = 210000;

segnet4.genesis = {
  version: 1,
  hash: 'b291211d4bb2b7e1b7a4758225e69e50104091a637213d033295c010f55ffb18',
  prevBlock: '0000000000000000000000000000000000000000000000000000000000000000',
  merkleRoot: '3ba3edfd7a7b12b27ac72c3e67768f617fc81bc3888a51323a9fb8aa4b1e5e4a',
  ts: 1452831101,
  bits: 503447551,
  nonce: 0,
  height: 0
};

segnet4.genesisBlock =
  '0100000000000000000000000000000000000000000000000000000000000000000000'
  + '003ba3edfd7a7b12b27ac72c3e67768f617fc81bc3888a51323a9fb8aa4b1e5e4a7d71'
  + '9856ffff011e0000000001010000000100000000000000000000000000000000000000'
  + '00000000000000000000000000ffffffff4d04ffff001d0104455468652054696d6573'
  + '2030332f4a616e2f32303039204368616e63656c6c6f72206f6e206272696e6b206f66'
  + '207365636f6e64206261696c6f757420666f722062616e6b73ffffffff0100f2052a01'
  + '000000434104678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f'
  + '61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5f'
  + 'ac00000000';

segnet4.pow = {
  // 512x lower min difficulty than mainnet
  limit: new BN(
    '000001ffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
    'hex'
  ),
  bits: 503447551,
  chainwork: new BN(
    '0000000000000000000000000000000000000000000000000000000000800040',
    'hex'
  ),
  targetTimespan: 14 * 24 * 60 * 60,
  targetSpacing: 10 * 60,
  retargetInterval: 2016,
  targetReset: true,
  noRetargeting: false
};

segnet4.block = {
  bip34height: 8,
  bip34hash: '6c48386dc7c460defabb5640e28b6510a5f238cdbe6756c2976a7e0913000000',
  bip65height: 8,
  bip65hash: '6c48386dc7c460defabb5640e28b6510a5f238cdbe6756c2976a7e0913000000',
  bip66height: 8,
  bip66hash: '6c48386dc7c460defabb5640e28b6510a5f238cdbe6756c2976a7e0913000000',
  pruneAfterHeight: 1000,
  keepBlocks: 10000,
  maxTipAge: 7 * 24 * 60 * 60,
  slowHeight: 50000
};

segnet4.bip30 = {};

segnet4.activationThreshold = 108;

segnet4.minerWindow = 144;

segnet4.deployments = {
  testdummy: {
    name: 'testdummy',
    bit: 28,
    startTime: 1199145601, // January 1, 2008
    timeout: 1230767999, // December 31, 2008
    force: true
  },
  csv: {
    name: 'csv',
    bit: 0,
    startTime: 1456790400, // March 1st, 2016
    timeout: 1493596800, // May 1st, 2017
    force: true
  },
  segwit: {
    name: 'segwit',
    bit: 1,
    startTime: 0,
    timeout: 0xffffffff,
    force: false
  }
};

segnet4.deploys = [
  segnet4.deployments.csv,
  segnet4.deployments.segwit,
  segnet4.deployments.testdummy
];

segnet4.keyPrefix = {
  privkey: 0x9e,
  xpubkey: 0x053587cf,
  xprivkey: 0x05358394,
  xprivkey58: '2791',
  xpubkey58: '2793',
  coinType: 1
};

segnet4.addressPrefix = {
  pubkeyhash: 0x1e,
  scripthash: 0x32,
  witnesspubkeyhash: 0x03,
  witnessscripthash: 0x28,
  bech32: 'tb'
};

segnet4.requireStandard = false;

segnet4.rpcPort = 28902;

segnet4.minRelay = 1000;

segnet4.feeRate = 20000;

segnet4.maxFeeRate = 60000;

segnet4.selfConnect = false;

segnet4.requestMempool = true;

/*
 * Simnet (btcd)
 */

simnet = network.simnet = {};

simnet.type = 'simnet';

simnet.seeds = [
  '127.0.0.1'
];

simnet.magic = 0x12141c16;

simnet.port = 18555;

simnet.checkpointMap = {};

simnet.lastCheckpoint = 0;

simnet.halvingInterval = 210000;

simnet.genesis = {
  version: 1,
  hash: 'f67ad7695d9b662a72ff3d8edbbb2de0bfa67b13974bb9910d116d5cbd863e68',
  prevBlock: '0000000000000000000000000000000000000000000000000000000000000000',
  merkleRoot: '3ba3edfd7a7b12b27ac72c3e67768f617fc81bc3888a51323a9fb8aa4b1e5e4a',
  ts: 1401292357,
  bits: 545259519,
  nonce: 2,
  height: 0
};

simnet.genesisBlock =
  '0100000000000000000000000000000000000000000000000000000000000000000000'
  + '003ba3edfd7a7b12b27ac72c3e67768f617fc81bc3888a51323a9fb8aa4b1e5e4a4506'
  + '8653ffff7f200200000001010000000100000000000000000000000000000000000000'
  + '00000000000000000000000000ffffffff4d04ffff001d0104455468652054696d6573'
  + '2030332f4a616e2f32303039204368616e63656c6c6f72206f6e206272696e6b206f66'
  + '207365636f6e64206261696c6f757420666f722062616e6b73ffffffff0100f2052a01'
  + '000000434104678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f'
  + '61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5f'
  + 'ac00000000';

simnet.pow = {
  limit: new BN(
    // High target of 0x207fffff (545259519)
    '7fffff0000000000000000000000000000000000000000000000000000000000',
    'hex'
  ),
  bits: 545259519,
  chainwork: new BN(
    '0000000000000000000000000000000000000000000000000000000000000002',
    'hex'
  ),
  targetTimespan: 14 * 24 * 60 * 60,
  targetSpacing: 10 * 60,
  retargetInterval: 2016,
  targetReset: true,
  noRetargeting: false
};

simnet.block = {
  bip34height: 0,
  bip34hash: 'f67ad7695d9b662a72ff3d8edbbb2de0bfa67b13974bb9910d116d5cbd863e68',
  bip65height: 0,
  bip65hash: 'f67ad7695d9b662a72ff3d8edbbb2de0bfa67b13974bb9910d116d5cbd863e68',
  bip66height: 0,
  bip66hash: 'f67ad7695d9b662a72ff3d8edbbb2de0bfa67b13974bb9910d116d5cbd863e68',
  pruneAfterHeight: 1000,
  keepBlocks: 10000,
  maxTipAge: 0xffffffff,
  slowHeight: 0
};

simnet.bip30 = {};

simnet.activationThreshold = 75; // 75% for testchains

simnet.minerWindow = 100; // nPowTargetTimespan / nPowTargetSpacing

simnet.deployments = {
  testdummy: {
    name: 'testdummy',
    bit: 28,
    startTime: 1199145601, // January 1, 2008
    timeout: 1230767999, // December 31, 2008
    force: true
  },
  csv: {
    name: 'csv',
    bit: 0,
    startTime: 0, // March 1st, 2016
    timeout: 0xffffffff, // May 1st, 2017
    force: true
  },
  segwit: {
    name: 'segwit',
    bit: 1,
    startTime: 0, // May 1st 2016
    timeout: 0xffffffff, // May 1st 2017
    force: false
  },
  mast: {
    name: 'mast',
    bit: 2,
    startTime: 0xffffffff, // Far in the future
    timeout: 0xffffffff,
    force: false
  }
};

simnet.deploys = [
  simnet.deployments.csv,
  simnet.deployments.segwit,
  simnet.deployments.mast,
  simnet.deployments.testdummy
];

simnet.keyPrefix = {
  privkey: 0x64,
  xpubkey: 0x0420bd3a,
  xprivkey: 0x0420b900,
  xprivkey58: 'sprv',
  xpubkey58: 'spub',
  coinType: 115
};

simnet.addressPrefix = {
  pubkeyhash: 0x3f,
  scripthash: 0x7b,
  witnesspubkeyhash: 0x19,
  witnessscripthash: 0x28,
  bech32: 'tb'
};

simnet.requireStandard = false;

simnet.rpcPort = 18556;

simnet.minRelay = 1000;

simnet.feeRate = 20000;

simnet.maxFeeRate = 60000;

simnet.selfConnect = false;

simnet.requestMempool = false;
