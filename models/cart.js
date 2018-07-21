function Cart(oldCart) {
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;
}

Cart.prototype.add = function(item, id) {
  var storedItem = this.items[id];

  // in case an item has not yet been added to the cart
  if (!storedItem) {
    storedItem = this.items[id] = { item: item, qty: 0, price: 0 };
  }

  storedItem.qty++;
  storedItem.price = storedItem.item.price * storedItem.qty;
  this.totalQty++;
  this.totalPrice += storedItem.item.price;
}

Cart.prototype.reduceByOne = function(id) {
  this.items[id].qty--;
  this.items[id].price -= this.items[id].item.price;
  this.totalQty--;
  this.totalPrice -= this.items[id].item.price;

  if (this.items[id].qty <= 0) {
    delete this.items[id];
  }
}

Cart.prototype.removeItem = function(id) {
  this.totalQty -= this.items[id].qty;
  this.totalPrice -= this.items[id].price;
  delete this.items[id];
}

Cart.prototype.generateArray = function() {
  var arr = [];

  for (var id in this.items) {
    arr.push(this.items[id]);
  }

  return arr;
}

module.exports = Cart;