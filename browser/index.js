;(function() {

'use strict';

var util = bcoin.util;
var body = document.getElementsByTagName('body')[0];
var log = document.getElementById('log');
var wdiv = document.getElementById('wallet');
var tdiv = document.getElementById('tx');
var floating = document.getElementById('floating');
var send = document.getElementById('send');
var newaddr = document.getElementById('newaddr');
var chainState = document.getElementById('state');
var rpc = document.getElementById('rpc');
var cmd = document.getElementById('cmd');
var items = [];
var scrollback = 0;
var logger, node, wdb;

body.onmouseup = function() {
  floating.style.display = 'none';
};

floating.onmouseup = function(ev) {
  ev.stopPropagation();
  return false;
};

function show(obj) {
  floating.innerHTML = escape(util.inspectify(obj, false));
  floating.style.display = 'block';
}
 

logger = new bcoin.logger({ level: 'debug', console: true });

logger.writeConsole = function(level, module, args) {
  console.log(level,module,args);
};

logger.info = function(level, module, args) {
  console.log(level,module,args);
};

rpc.onsubmit = function(ev) {
  var text = cmd.value || '';
  var argv = text.trim().split(/\s+/);
  var method = argv.shift();
  var params = [];
  var i, arg, param;

  cmd.value = '';

  for (i = 0; i < argv.length; i++) {
    arg = argv[i];
    try {
      param = JSON.parse(arg);
    } catch (e) {
      param = arg;
    }
    params.push(param);
  }

  node.rpc.execute({ method: method, params: params }).then(show, show);

  ev.preventDefault();
  ev.stopPropagation();

  return false;
};

send.onsubmit = function(ev) {
  var value = document.getElementById('amount').value;
  var address = document.getElementById('address').value;
  var tx, options;

  options = {
    outputs: [{
      address: address,
      value: bcoin.amount.value(value)
    }]
  };

  wdb.primary.createTX(options).then(function(mtx) {
    tx = mtx;
    return wdb.primary.sign(tx);
  }).then(function() {
    return node.sendTX(tx);
  }).then(function() {
    show(tx);
  });

  ev.preventDefault();
  ev.stopPropagation();

  return false;
};

newaddr.onmouseup = function() {
  wdb.primary.createReceive().then(function() {
    formatWallet(wdb.primary);
  });
};

function kb(size) {
  size /= 1000;
  return size.toFixed(2) + 'kb';
}

function create(html) {
  var el = document.createElement('div');
  el.innerHTML = html;
  return el.firstChild;
}

function escape(html, encode) {
  return html
    .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function addItem(item, entry) {
  var height = entry ? entry.height : -1;
  var el;

  if (items.length === 20) {
    el = items.shift();
    tdiv.removeChild(el);
    el.onmouseup = null;
  }

  el = create('<a style="display:block;" href="#'
    + item.rhash() + '">' + item.rhash() + ' (' + height
    + ' - ' + kb(item.getSize()) + ')</a>');
  tdiv.appendChild(el);

  setMouseup(el, item);

  items.push(el);

  chainState.innerHTML = ''
    + 'tx=' + node.chain.db.state.tx
    + ' coin=' + node.chain.db.state.coin
    + ' value=' + bcoin.amount.btc(node.chain.db.state.value);
}

function setMouseup(el, obj) {
  el.onmouseup = function(ev) {
    show(obj);
    ev.stopPropagation();
    return false;
  };
}

function formatWallet(wallet) {
  var html = '';
  var json = wallet.master.toJSON(true);
  var i, tx, el;

  html += '<b>Wallet</b><br>';

  if (wallet.account.witness) {
    html += 'Current Address (p2wpkh): <b>'
      + wallet.getAddress()
      + '</b><br>';
    html += 'Current Address (p2wpkh behind p2sh): <b>'
      + wallet.getNestedAddress()
      + '</b><br>';
  } else {
    html += 'Current Address: <b>' + wallet.getAddress() + '</b><br>';
  }

  html += 'Extended Private Key: <b>' + json.key.xprivkey + '</b><br>';
  html += 'Mnemonic: <b>' + json.mnemonic.phrase + '</b><br>';

  wallet.getBalance().then(function(balance) {
    html += 'Confirmed Balance: <b>'
      + bcoin.amount.btc(balance.confirmed)
      + '</b><br>';

    html += 'Unconfirmed Balance: <b>'
      + bcoin.amount.btc(balance.unconfirmed)
      + '</b><br>';

    return wallet.getHistory();
  }).then(function(txs) {
    return wallet.toDetails(txs);
  }).then(function(txs) {
    html += 'TXs:\n';
    wdiv.innerHTML = html;

    for (i = 0; i < txs.length; i++) {
      tx = txs[i];

      el = create(
        '<a style="display:block;" href="#' + tx.hash + '">'
        + tx.hash + '</a>');

      wdiv.appendChild(el);
      setMouseup(el, tx.toJSON());
    }
  });
}

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
  maxPeers: 8
});

/*

{"Salt":"HpYrU6xCem8jG26QVacXEt1XIrddGM4Eo4n3i1ISFTRY2g/jaDXj6WjNT2A4OUSKPMlvtWFA8eBIYNgvUFHfUg==","Iterations":64000,
"EncryptedKey":"X3Epvz6LA88yIKVM+hxxuQdO6dgpIBCFkPjS5lkljd+vSrJPqGkzz02M4/VVwFTfnaIpVLzQuy4+IxMB+t/QU0s74dPCgRO/4ov+ocP92dm8tNyluKYvXsRhYlTgkrfmJxGm+srUR0ve0SrMP4totA==",
"EncryptedWalletPassword":"gNyXBL3/dfLZmc/1kw9TM5f51HnEbqFakbrzrQqnOvo=","EncryptedIdentifier":"Uvxs+7/VuzWlp1S42pmUDpJ4PgDLE3Y0j8FBBaCqI69pkd5v+E7hlSqQxk/V4x2EE3IY7Ai3Tv0R1JR21wMzHg==","Version":"1.2"}

*/

var walletdb = new bcoin.walletdb({ db: 'memory', spv: true });
//1QE8ByvStmhb62zKpKTKujc6FNRqC2RfFV
//WLTJqUYryqwPS4CKrBVMbMHYZCzhrBVnnezu
// var xkey = { "xprivkey" : "xprv9s21ZrQH143K2Q8H18WMuiUzhMGpgnWguWoXKpkSEKCNakiSAXV8RfgZwxKh6qU7WCckJGrHkEMxKVKqQC5R1zikyNS5oaQ2n1FcJumPBD3"};

// pool.open().then(function() {
//   return walletdb.open();
// }).then(function() {
//   walletdb.getAccounts(0).then(function(res){
//     console.log(res);
//   })
  
//   var myWallet = new bcoin.wallet.Wallet(walletdb,)

//   // // myWallet.importKey();
  
//   // console.log(myWallet);
//   // console.log(myWallet.getAddress());
// });


//xprv9s21ZrQH143K2bgLxDBR57jtCueuYYMYREehNPzZQvTKX49Z23MLYwJ6kCShgEz4vVsEf5FBptWAibyEatYDJMTKV8tTrRgFxsWTtRzKGoK 5KZ //1Pxt8ssYWSFSgcgZ4gHVqAe4SjZVAYxzAF
//xprv9s21ZrQH143K2Q8H18WMuiUzhMGpgnWguWoXKpkSEKCNakiSAXV8RfgZwxKh6qU7WCckJGrHkEMxKVKqQC5R1zikyNS5oaQ2n1FcJumPBD3 2tB //1QE8ByvStmhb62zKpKTKujc6FNRqC2RfFV
// REAL xprv9s21ZrQH143K2ZVuyZYuv8uFKcGYTsEWCb3cKV1FzQj45oqFiQts2gVZ4qfjfso3J74Snru1ZYAmarb8dHcDwtuWkoPJ6wr8vz269oQCrDp


pool.open().then(function() {
  return walletdb.open();
}).then(function() {
  return walletdb.create({
    "master": "xprv9s21ZrQH143K2ZVuyZYuv8uFKcGYTsEWCb3cKV1FzQj45oqFiQts2gVZ4qfjfso3J74Snru1ZYAmarb8dHcDwtuWkoPJ6wr8vz269oQCrDp",
    "id": "AirBitzMain"
  });

  // return walletdb.create();
}).then(function(wallet) {
  console.log(wallet);
  // console.log(walletdb.toJSON());
  console.log('Main address: %s', wallet.getAddress('base58'));
  
  // console.log(wallet.master.key.toJSON());
  wallet.account.receiveDepth = 3;
   
  console.log("R => ",wallet.account.receiveDepth);

  
  wallet.createKey(0).then(function (res){
    console.log("NEW", res.getAddress('base58'),res);
    wallet.createKey(0).then(function (res){
      console.log("NEW", res.getAddress('base58'),res);
      wallet.createKey(0).then(function (res){
        console.log("NEW", res.getAddress('base58'),res);
        console.log("R => ",wallet.account.receiveDepth);
      });
    });
  });

  

  
   
   

  




  // Add our address to the spv filter.
  pool.watchAddress(wallet.getAddress());

  // Connect, start retrieving and relaying txs
  pool.connect().then(function() {
    // Start the blockchain sync.
    pool.startSync();

    pool.on('tx', function(tx) {
      walletdb.addTX(tx);
    });

    wallet.on('balance', function(balance) {
      console.log('Balance updated.');
      console.log(bcoin.amount.btc(balance.unconfirmed));
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
