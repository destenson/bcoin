;(function() {

'use strict';

var util = bcoin.util;
 
var items = [];
var scrollback = 0;
var logger, node, wdb;
var levelsByVal = [
  'none',
  'error',
  'warning',
  'info',
  'debug',
  'spam'
];

console.html = function (msg){
  $("#consoleLogs").append("<div class='info'>"+msg+"</div>");
  $("#consoleLogs").scrollTop($("#consoleLogs")[0].scrollHeight);
}

console.nhtml = function (level,module,args){
  $("#networkLogs").append("<div class='info "+levelsByVal[level]+"'>"+levelsByVal[level]+" "+module+args.join("/")+"</div>");
  // $("#networkLogs").scrollIntoView();
  $("#networkLogs").scrollTop($("#networkLogs")[0].scrollHeight);
  // $("#networkLogs").animate({ scrollTop: $("#networkLogs")[0].scrollHeight }, "fast");
}

 

logger = new bcoin.logger({ level: 'debug', console: true });
logger.open();

logger.writeConsole = function(level, module, args) {
  console.nhtml(level,module,args);
};

logger.info = function(level, module, args) {
  console.nhtml(level,module,args);
};
      

var chain = new bcoin.chain({
  db: 'leveldb',
  location: "/spvchain",
  spv: true,
  network: 'main',
  logConsole: true,
  logger: logger
});

var pool = new bcoin.pool({
  chain: chain,
  spv: true,
  maxPeers: 8,
  logger: logger
});

/*

{"Salt":"HpYrU6xCem8jG26QVacXEt1XIrddGM4Eo4n3i1ISFTRY2g/jaDXj6WjNT2A4OUSKPMlvtWFA8eBIYNgvUFHfUg==","Iterations":64000,
"EncryptedKey":"X3Epvz6LA88yIKVM+hxxuQdO6dgpIBCFkPjS5lkljd+vSrJPqGkzz02M4/VVwFTfnaIpVLzQuy4+IxMB+t/QU0s74dPCgRO/4ov+ocP92dm8tNyluKYvXsRhYlTgkrfmJxGm+srUR0ve0SrMP4totA==",
"EncryptedWalletPassword":"gNyXBL3/dfLZmc/1kw9TM5f51HnEbqFakbrzrQqnOvo=","EncryptedIdentifier":"Uvxs+7/VuzWlp1S42pmUDpJ4PgDLE3Y0j8FBBaCqI69pkd5v+E7hlSqQxk/V4x2EE3IY7Ai3Tv0R1JR21wMzHg==","Version":"1.2"}

*/

var walletdb = new bcoin.walletdb({ db: 'memory', spv: true, logger: logger });
//1QE8ByvStmhb62zKpKTKujc6FNRqC2RfFV
//WLTJqUYryqwPS4CKrBVMbMHYZCzhrBVnnezu
// var xkey = { "xprivkey" : "xprv9s21ZrQH143K2Q8H18WMuiUzhMGpgnWguWoXKpkSEKCNakiSAXV8RfgZwxKh6qU7WCckJGrHkEMxKVKqQC5R1zikyNS5oaQ2n1FcJumPBD3"};

// pool.open().then(function() {
//   return walletdb.open();
// }).then(function() {
//   walletdb.getAccounts(0).then(function(res){
//     console.html(res);
//   })
  
//   var myWallet = new bcoin.wallet.Wallet(walletdb,)

//   // // myWallet.importKey();
  
//   // console.html(myWallet);
//   // console.html(myWallet.getAddress());
// });


//xprv9s21ZrQH143K2bgLxDBR57jtCueuYYMYREehNPzZQvTKX49Z23MLYwJ6kCShgEz4vVsEf5FBptWAibyEatYDJMTKV8tTrRgFxsWTtRzKGoK 5KZ //1Pxt8ssYWSFSgcgZ4gHVqAe4SjZVAYxzAF
//xprv9s21ZrQH143K2Q8H18WMuiUzhMGpgnWguWoXKpkSEKCNakiSAXV8RfgZwxKh6qU7WCckJGrHkEMxKVKqQC5R1zikyNS5oaQ2n1FcJumPBD3 2tB //1QE8ByvStmhb62zKpKTKujc6FNRqC2RfFV
// REAL xprv9s21ZrQH143K2ZVuyZYuv8uFKcGYTsEWCb3cKV1FzQj45oqFiQts2gVZ4qfjfso3J74Snru1ZYAmarb8dHcDwtuWkoPJ6wr8vz269oQCrDp



pool.open().then(function() {
  return walletdb.open({logger:logger});
}).then(function() {
  return walletdb.create({
    "master": "xprv9s21ZrQH143K2ZVuyZYuv8uFKcGYTsEWCb3cKV1FzQj45oqFiQts2gVZ4qfjfso3J74Snru1ZYAmarb8dHcDwtuWkoPJ6wr8vz269oQCrDp",
    "id": "AirBitzMain"
  });

  // return walletdb.create();
}).then(function(wallet) {
  // console.html(wallet);
  // console.html(walletdb.toJSON());
  console.html("Root m/0/0/0 => "+wallet.getID());

  console.html('Main address: '+ wallet.getAddress('base58check'));
  
  // console.html(wallet.master.key.toJSON());
  // wallet.account.receiveDepth = 3;

  // console.html("R => ",wallet.getID());
  // console.html("receive => ",wallet.account.receive);

  

  // console.html(logger);
  
  wallet.getAccountPaths(0).then(function(result){
    var a;
    for (var i in result){
      a =result[i].toAddress();

      // console.html("Paths======>",a.toString());
    }
  });
  pool.watchAddress(wallet.getAddress('base58check'));
  

  // wallet.getBalance(0).then(function(result){
  //     console.html("Balance======>",result);
  // });

  for (var i=0;i<10;i++){
    wallet.createKey(0).then(function (res){
      pool.watchAddress(res.getAddress('base58check'));  
      console.html("watching " + res.getAddress('base58check'));
    });
  }
  
  // Add our address to the spv filter.
  

  // Connect, start retrieving and relaying txs
  pool.connect().then(function() {
    // Start the blockchain sync.
    pool.startSync();

    pool.on('tx', function(tx) {
      walletdb.addTX(tx);
    });

    wallet.on('balance', function(balance) {
      console.html('Balance updated.');
      console.html(bcoin.amount.btc(balance.unconfirmed));
    });
  });
});


// node = new bcoin.fullnode({
//   hash: true,
//   query: true,
//   prune: true,
//   network: 'main',
//   db: 'leveldb',
//   coinCache: 1,
//   maxPeers:8,
//   logConsole: true,
//   logger: logger,
//   spv: true
// });

// wdb = node.use(bcoin.walletplugin);

// node.on('error', function(err) {
//   ;
// });

// node.chain.on('block', addItem);
// node.mempool.on('tx', addItem);

// node.open().then(function() {
//   return node.connect();
// }).then(function() {
//   node.startSync();

//   wdb.primary.on('balance', function() {
//     formatWallet(wdb.primary);
//   });

//   formatWallet(wdb.primary);
// }).catch(function(err) {
//   throw err;
// });

})();
