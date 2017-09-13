/*!
 * rbt.js - iterative red black tree for bcoin
 * Copyright (c) 2016-2017, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bcoin
 */

'use strict';

const assert = require('assert');
const BufferReader = require('../utils/reader');
const StaticWriter = require('../utils/staticwriter');
const RED = 0;
const BLACK = 1;
let SENTINEL;

/**
 * An iterative red black tree.
 * @alias module:utils.RBT
 * @constructor
 * @param {Function} compare - Comparator.
 * @param {Boolean?} unique
 */

function RBT(compare, unique) {
  if (!(this instanceof RBT))
    return new RBT(compare, unique);

  assert(typeof compare === 'function');

  this.root = SENTINEL;

  this.compare = compare;
  this.unique = unique || false;
}

/**
 * Clear the tree.
 */

RBT.prototype.reset = function reset() {
  this.root = SENTINEL;
};

/**
 * Do a key lookup.
 * @param {Buffer|String} key
 * @returns {Buffer?} value
 */

RBT.prototype.search = function search(key) {
  let current = this.root;

  while (!current.isNull()) {
    const cmp = this.compare(key, current.key);

    if (cmp === 0)
      return current;

    if (cmp < 0)
      current = current.left;
    else
      current = current.right;
  }

  return null;
};

/**
 * Insert a record.
 * @param {Buffer|String} key
 * @param {Buffer} value
 */
RBT.prototype.insert = function insert(key, value) {
  let current = this.root;
  let left = false;
  let parent;

  while (!current.isNull()) {
    const cmp = this.compare(key, current.key);

    if (this.unique && cmp === 0) {
      current.key = key;
      current.value = value;
      return current;
    }

    parent = current;

    if (cmp < 0) {
      left = true;
      current = current.left;
    } else {
      left = false;
      current = current.right;
    }
  }

  const node = new RBTNode(key, value);

  if (!parent) {
    this.root = node;
    this.insertFixup(node);
    return node;
  }

  node.parent = parent;

  if (left)
    parent.left = node;
  else
    parent.right = node;

  this.insertFixup(node);

  return node;
};

/**
 * Repaint necessary nodes after insertion.
 * @private
 * @param {RBTNode} x
 */

RBT.prototype.insertFixup = function insertFixup(x) {
  x.color = RED;

  while (x !== this.root && x.parent.color === RED) {
    if (x.parent === x.parent.parent.left) {
      const y = x.parent.parent.right;
      if (!y.isNull() && y.color === RED) {
        x.parent.color = BLACK;
        y.color = BLACK;
        x.parent.parent.color = RED;
        x = x.parent.parent;
      } else {
        if (x === x.parent.right) {
          x = x.parent;
          this.rotl(x);
        }
        x.parent.color = BLACK;
        x.parent.parent.color = RED;
        this.rotr(x.parent.parent);
      }
    } else {
      const y = x.parent.parent.left;
      if (!y.isNull() && y.color === RED) {
        x.parent.color = BLACK;
        y.color = BLACK;
        x.parent.parent.color = RED;
        x = x.parent.parent;
      } else {
        if (x === x.parent.left) {
          x = x.parent;
          this.rotr(x);
        }
        x.parent.color = BLACK;
        x.parent.parent.color = RED;
        this.rotl(x.parent.parent);
      }
    }
  }

  this.root.color = BLACK;
};

/**
 * Remove a record.
 * @param {Buffer|String} key
 * @returns {Boolean}
 */

RBT.prototype.remove = function remove(key) {
  let current = this.root;

  while (!current.isNull()) {
    const cmp = this.compare(key, current.key);

    if (cmp === 0) {
      this.removeNode(current);
      return current;
    }

    if (cmp < 0)
      current = current.left;
    else
      current = current.right;
  }

  return null;
};

/**
 * Remove a single node.
 * @private
 * @param {RBTNode} z
 */

RBT.prototype.removeNode = function removeNode(z) {
  let y = z;

  if (!z.left.isNull() && !z.right.isNull())
    y = this.successor(z);

  const x = y.left.isNull() ? y.right : y.left;
  x.parent = y.parent;

  if (y.parent.isNull()) {
    this.root = x;
  } else {
    if (y === y.parent.left)
      y.parent.left = x;
    else
      y.parent.right = x;
  }

  if (y !== z) {
    z.key = y.key;
    z.value = y.value;
  }

  if (y.color === BLACK)
    this.removeFixup(x);
};

/**
 * Repaint necessary nodes after removal.
 * @private
 * @param {RBTNode} x
 */

RBT.prototype.removeFixup = function removeFixup(x) {
  while (x !== this.root && x.color === BLACK) {
    if (x === x.parent.left) {
      let w = x.parent.right;

      if (w.color === RED) {
        w.color = BLACK;
        x.parent.color = RED;
        this.rotl(x.parent);
        w = x.parent.right;
      }

      if (w.left.color === BLACK && w.right.color === BLACK) {
        w.color = RED;
        x = x.parent;
      } else {
        if (w.right.color === BLACK) {
          w.left.color = BLACK;
          w.color = RED;
          this.rotr(w);
          w = x.parent.right;
        }
        w.color = x.parent.color;
        x.parent.color = BLACK;
        w.right.color = BLACK;
        this.rotl(x.parent);
        x = this.root;
      }
    } else {
      let w = x.parent.left;

      if (w.color === RED) {
        w.color = BLACK;
        x.parent.color = RED;
        this.rotr(x.parent);
        w = x.parent.left;
      }

      if (w.right.color === BLACK && w.left.color === BLACK) {
        w.color = RED;
        x = x.parent;
      } else {
        if (w.left.color === BLACK) {
          w.right.color = BLACK;
          w.color = RED;
          this.rotl(w);
          w = x.parent.left;
        }
        w.color = x.parent.color;
        x.parent.color = BLACK;
        w.left.color = BLACK;
        this.rotr(x.parent);
        x = this.root;
      }
    }
  }

  x.color = BLACK;
};

/**
 * Do a left rotate.
 * @private
 * @param {RBTNode} x
 */

RBT.prototype.rotl = function rotl(x) {
  const y = x.right;

  x.right = y.left;

  if (!y.left.isNull())
    y.left.parent = x;

  y.parent = x.parent;

  if (x.parent.isNull()) {
    this.root = y;
  } else {
    if (x === x.parent.left)
      x.parent.left = y;
    else
      x.parent.right = y;
  }

  y.left = x;
  x.parent = y;
};

/**
 * Do a right rotate.
 * @private
 * @param {RBTNode} x
 */

RBT.prototype.rotr = function rotr(x) {
  const y = x.left;

  x.left = y.right;

  if (!y.right.isNull())
    y.right.parent = x;

  y.parent = x.parent;

  if (x.parent.isNull()) {
    this.root = y;
  } else {
    if (x === x.parent.right)
      x.parent.right = y;
    else
      x.parent.left = y;
  }

  y.right = x;
  x.parent = y;
};

/**
 * Minimum subtree.
 * @private
 * @param {RBTNode} z
 * @returns {RBTNode}
 */

RBT.prototype.min = function min(z) {
  if (z.isNull())
    return z;

  while (!z.left.isNull())
    z = z.left;

  return z;
};

/**
 * Maximum subtree.
 * @private
 * @param {RBTNode} z
 * @returns {RBTNode}
 */

RBT.prototype.max = function max(z) {
  if (z.isNull())
    return z;

  while (!z.right.isNull())
    z = z.right;

  return z;
};

/**
 * Successor node.
 * @private
 * @param {RBTNode} x
 * @returns {RBTNode}
 */

RBT.prototype.successor = function successor(x) {
  if (!x.right.isNull()) {
    x = x.right;

    while (!x.left.isNull())
      x = x.left;

    return x;
  }

  let y = x.parent;
  while (!y.isNull() && x === y.right) {
    x = y;
    y = y.parent;
  }

  return y;
};

/**
 * Predecessor node.
 * @private
 * @param {RBTNode} x
 * @returns {RBTNode}
 */

RBT.prototype.predecessor = function predecessor(x) {
  if (!x.left.isNull()) {
    x = x.left;

    while (!x.right.isNull())
      x = x.right;

    return x;
  }

  let y = x.parent;
  while (!y.isNull() && x === y.left) {
    x = y;
    y = y.parent;
  }

  return y;
};

/**
 * Take a snapshot and return
 * a cloned root node (iterative).
 * @returns {RBTNode}
 */

RBT.prototype.clone = function clone() {
  if (this.root.isNull())
    return SENTINEL;

  const stack = [];

  let current = this.root;
  let left = true;
  let parent, snapshot;

  for (;;) {
    if (!current.isNull()) {
      const copy = current.clone();

      if (parent)
        copy.parent = parent;

      if (left) {
        if (parent)
          parent.left = copy;
        else
          snapshot = copy;
      } else {
        if (parent)
          parent.right = copy;
        else
          snapshot = copy;
      }

      stack.push(copy);
      parent = copy;
      left = true;
      current = current.left;
      continue;
    }

    if (stack.length === 0)
      break;

    current = stack.pop();
    parent = current;
    left = false;
    current = current.right;
  }

  assert(snapshot);

  return snapshot;
};

RBT.prototype.toRaw = function toRaw() {
  const rootData = this.root.toRaw();
  const rootLength = rootData.length;
  const unique = this.unique ? 1 : 0;

  const size = rootLength + 1 + 8;
  const bw = new StaticWriter(size);
  
  bw.writeU64(rootLength);
  bw.writeBytes(rootData);
  bw.writeU8(unique);
  
  return bw.render();
}

RBT.prototype.fromRaw = function fromRaw(data) {
  const br = new BufferReader(data);

  const rootLength = br.readU64();
  const rootData = br.readBytes(rootLength);
  const unique = !!br.readU8();
  this.unique = unique
  if (rootLength) {
    this.root = RBTNode.fromRaw(rootData)
  }
  return this;
}

RBT.prototype.fromOptions = function fromOptions(opt) {  
  if (opt.data) {
    assert(opt.data.length > 0)
    this.fromRaw(opt.data)
  }
  return this
}

RBT.fromOptions = function fromOptions(opt) {  
  assert(opt)
  assert(typeof opt.compare === 'function')
  return new RBT(opt.compare, opt.unique).fromOptions(opt)
}

/**
 * Take a snapshot and return
 * a cloned root node (recursive).
 * @returns {RBTNode}
 */

RBT.prototype.snapshot = function snapshot() {
  if (this.root.isNull())
    return SENTINEL;

  const node = this.root.clone();

  copyLeft(node, node.left);
  copyRight(node, node.right);

  return node;
};

/**
 * Create an iterator.
 * @param {RBTNode?} snapshot
 * @returns {Iterator}
 */

RBT.prototype.iterator = function iterator(snapshot) {
  return new Iterator(this, snapshot || this.root);
};

/**
 * Traverse between a range of keys and collect records.
 * @param {Buffer} min
 * @param {Buffer} max
 * @returns {RBTNode[]} Records.
 */

RBT.prototype.range = function range(min, max) {
  const iter = this.iterator();
  const items = [];

  if (min)
    iter.seekMin(min);
  else
    iter.seekFirst();

  while (iter.next()) {
    if (max && iter.compare(max) > 0)
      break;

    items.push(iter.data());
  }

  return items;
};

/**
 * Iterator
 * @constructor
 * @ignore
 * @param {RBT} tree
 * @param {RBTNode} snapshot
 * @property {RBT} tree
 * @property {RBTNode} current
 * @property {Object} key
 * @property {Object} value
 */

function Iterator(tree, snapshot) {
  this.tree = tree;
  this.root = snapshot;
  this.current = snapshot;
  this.key = null;
  this.value = null;
}

/**
 * Compare keys using tree's comparator.
 * @param {Object} key
 */

Iterator.prototype.compare = function compare(key) {
  assert(this.key != null, 'No key.');
  return this.tree.compare(this.key, key);
};

/**
 * Test whether current node is valid.
 */

Iterator.prototype.valid = function valid() {
  return !this.current.isNull();
};

/**
 * Seek to the root.
 */

Iterator.prototype.reset = function reset() {
  this.current = this.root;
  this.key = null;
  this.value = null;
};

/**
 * Seek to the start of the tree.
 */

Iterator.prototype.seekFirst = function seekFirst() {
  this.current = this.tree.min(this.root);
  this.key = this.current.key;
  this.value = this.current.value;
};

/**
 * Seek to the end of the tree.
 */

Iterator.prototype.seekLast = function seekLast() {
  this.current = this.tree.max(this.root);
  this.key = this.current.key;
  this.value = this.current.value;
};

/**
 * Seek to a key from the current node (gte).
 * @param {String} key
 */

Iterator.prototype.seek = function seek(key) {
  return this.seekMin(key);
};

/**
 * Seek to a key from the current node (gte).
 * @param {String} key
 */

Iterator.prototype.seekMin = function seekMin(key) {
  assert(key != null, 'No key passed to seek.');

  let root = this.current;
  let current = SENTINEL;

  while (!root.isNull()) {
    const cmp = this.tree.compare(root.key, key);

    if (cmp === 0) {
      current = root;
      break;
    }

    if (cmp > 0) {
      current = root;
      root = root.left;
    } else {
      root = root.right;
    }
  }

  this.current = current;
  this.key = current.key;
  this.value = current.value;
};

/**
 * Seek to a key from the current node (lte).
 * @param {String} key
 */

Iterator.prototype.seekMax = function seekMax(key) {
  assert(key != null, 'No key passed to seek.');

  let root = this.current;
  let current = SENTINEL;

  while (!root.isNull()) {
    const cmp = this.tree.compare(root.key, key);

    if (cmp === 0) {
      current = root;
      break;
    }

    if (cmp < 0) {
      current = root;
      root = root.right;
    } else {
      root = root.left;
    }
  }

  this.current = current;
  this.key = current.key;
  this.value = current.value;
};

/**
 * Seek to previous node.
 * @param {String} key
 */

Iterator.prototype.prev = function prev() {
  if (this.current.isNull()) {
    this.key = null;
    this.value = null;
    return false;
  }

  this.key = this.current.key;
  this.value = this.current.value;
  this.current = this.tree.predecessor(this.current);

  return true;
};

/**
 * Seek to next node.
 * @returns {Boolean}
 */

Iterator.prototype.next = function next() {
  if (this.current.isNull()) {
    this.key = null;
    this.value = null;
    return false;
  }

  this.key = this.current.key;
  this.value = this.current.value;
  this.current = this.tree.successor(this.current);

  return true;
};

/**
 * Return the current key/value pair.
 * @returns {RBTData}
 */

Iterator.prototype.data = function data() {
  assert(this.key != null, 'No data available.');
  return new RBTData(this.key, this.value);
};

/**
 * RBT Node
 * @constructor
 * @ignore
 * @private
 * @param {Buffer} key
 * @param {Buffer} value
 * @property {Buffer} key
 * @property {Buffer} value
 * @property {Number} color
 * @property {RBTNode|RBTSentinel} parent
 * @property {RBTNode|RBTSentinel} left
 * @property {RBTNode|RBTSentinel} right
 */

function RBTNode(key, value) {
  this.key = key;
  this.value = value;
  this.color = RED;
  this.parent = SENTINEL;
  this.left = SENTINEL;
  this.right = SENTINEL;
}

/**
 * Clone the node.
 * @returns {RBTNode}
 */

RBTNode.prototype.clone = function clone() {
  const node = new RBTNode(this.key, this.value);
  node.color = this.color;
  node.parent = this.parent;
  node.left = this.left;
  node.right = this.right;
  return node;
};

/**
 * Clone the node (key/value only).
 * @returns {RBTData}
 */

RBTNode.prototype.copy = function copy() {
  return new RBTData(this.key, this.value);
};

/**
 * Inspect the rbt node.
 * @returns {Object}
 */

RBTNode.prototype.inspect = function inspect() {
  return {
    key: this.key,
    value: this.value,
    color: this.color === RED ? 'red' : 'black',
    left: this.left,
    right: this.right
  };
};

RBTNode.prototype.toRaw = function toRaw() {  

  const data = new RBTData(this.key, this.value).toRaw();
  const dataLen = data.length;

  const leftRaw = this.left.isNull() ?  null : this.left.toRaw();
  const leftRawLen = leftRaw ? leftRaw.length : 0;
  
  const rightRaw = this.right.isNull() ?  null: this.right.toRaw();
  const rightRawLen = rightRaw ? rightRaw.length : 0;
  
  const size = dataLen + 1 + leftRawLen + rightRawLen + 8 * 3;
  const bw = new StaticWriter(size);
  
  bw.writeU64(dataLen);
  bw.writeBytes(data);
  bw.writeU8(this.color);
  bw.writeU64(leftRawLen);
  leftRaw && bw.writeBytes(leftRaw);
  bw.writeU64(rightRawLen);
  rightRaw && bw.writeBytes(rightRaw);
  
  return bw.render();
}

RBTNode.fromRaw = function fromRaw(data) {  
  
  const br = new BufferReader(data);

  const nodeDataLen = br.readU64();
  const nodeData = br.readBytes(nodeDataLen);
  const color = br.readU8();
  const leftRawLen = br.readU64();
  const leftRaw = br.readBytes(leftRawLen);
  const rightRawLen = br.readU64();
  const rightRaw = br.readBytes(rightRawLen);

  const rbtData = RBTData.fromRaw(nodeData);
  const { key, value } = rbtData;
  let node = new RBTNode(key, value);
  node.color = color;
  if (leftRawLen) {
    const leftNode = RBTNode.fromRaw(leftRaw);
    leftNode.parent = node;
    node.left = leftNode;
  }
  if (rightRawLen) {
    const rightNode = RBTNode.fromRaw(rightRaw);
    rightNode.parent = node;
    node.right = rightNode;
  }
  return node;
}

/**
 * Test whether the node is a leaf.
 * Always returns false.
 * @returns {Boolean}
 */

RBTNode.prototype.isNull = function isNull() {
  return false;
};

/**
 * RBT Sentinel Node
 * @constructor
 * @ignore
 * @property {null} key
 * @property {null} value
 * @property {Number} [color=BLACK]
 * @property {null} parent
 * @property {null} left
 * @property {null} right
 */

function RBTSentinel() {
  this.key = null;
  this.value = null;
  this.color = BLACK;
  this.parent = null;
  this.left = null;
  this.right = null;
}

/**
 * Inspect the rbt node.
 * @returns {String}
 */

RBTSentinel.prototype.inspect = function inspect() {
  return 'NIL';
};

/**
 * Test whether the node is a leaf.
 * Always returns true.
 * @returns {Boolean}
 */

RBTSentinel.prototype.isNull = function isNull() {
  return true;
};

/**
 * RBT key/value pair
 * @constructor
 * @ignore
 * @param {Buffer} key
 * @param {Buffer} value
 * @property {Buffer} key
 * @property {Buffer} value
 */

function RBTData(key, value) {
  this.key = key;
  this.value = value;
}

/**
 * Inspect the rbt data.
 * @returns {Object}
 */

RBTData.prototype.inspect = function inspect() {
  return {
    key: this.key,
    value: this.value
  };
};

RBTData.prototype.getSize = function getSize() {
  const keyLen = this.key ? this.key.length : 0;
  const valueLen = this.value ? this.value.length : 0;
  const sizeSeperators = 2 * 8;
  return sizeSeperators + keyLen + valueLen;
};

RBTData.prototype.toRaw = function toRaw() {
  const size = this.getSize();
  const bw = new StaticWriter(size);

  bw.writeU64(this.key.length);
  bw.writeBytes(this.key);
  bw.writeU64(this.value.length);
  bw.writeBytes(this.value);
  
  return bw.render();
};

RBTData.fromRaw = function fromRaw(data) {
  const br = new BufferReader(data);

  const keyLen = br.readU64();
  const key = br.readBytes(keyLen);
  const valueLen = br.readU64();
  const value = br.readBytes(valueLen);

  return new RBTData(key, value);
};

/*
 * Helpers
 */

SENTINEL = new RBTSentinel();

function copyLeft(parent, node) {
  if (!node.isNull()) {
    parent.left = node.clone();
    parent.left.parent = parent;
    copyLeft(parent.left, node.left);
    copyRight(parent.left, node.right);
  }
}

function copyRight(parent, node) {
  if (!node.isNull()) {
    parent.right = node.clone();
    parent.right.parent = parent;
    copyLeft(parent.right, node.left);
    copyRight(parent.right, node.right);
  }
}

/*
 * Expose
 */

module.exports = RBT;
