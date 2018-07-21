var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
var Product = require('../models/product');
var Order = require('../models/order');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/shopping', { useNewUrlParser: true }, err => {
    if (err) throw err;
    console.log(`Successfully connected to database.`);
});

/* GET home page. */
router.get('/', function(req, res, next) {
  var successMsg = req.flash('success')[0];
  var products = Product.find(function(err,docs) {
    var productChunks = [];
    var chunkSize = 3;
    for( var i = 0; i < docs.length; i+= chunkSize){
      productChunks.push(docs.slice(i, i + chunkSize));
    }
    res.render('shop/index', {title: 'Shopping Cart', products: productChunks, successMsg: successMsg, noMessages: !successMsg});
  });
});

router.get('/add-to-cart/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : { items: {} });

  Product.findById(productId, function(err, product) {
    if (err) {
      res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.card);
    res.redirect('/');
  });
});

router.get('/remove/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : { items: {} });

  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/reduce/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : { items: {} });

  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/shopping-cart', function(req, res, next) {
  var params = {};

  if (req.session.cart) {
    var cart = new Cart(req.session.cart);
    params.products = cart.generateArray();
    params.totalPrice = cart.totalPrice;
  }

  res.render('shop/shopping-cart', params);
});

router.get('/checkout', isLoggedIn, function(req,res, next){
  if(!req.session.cart){
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];
  res.render('shop/checkout', {
    total: cart.totalPrice,
    errMsg: errMsg,
    noError: !errMsg
  });
});

router.get('/additem', isLoggedIn, function(req,res, next){
  if(!req.session.cart){
    return res.redirect('/shopping-cart');
  }
  var errMsg = req.flash('error')[0];
  res.render('shop/add-item', {
    errMsg: errMsg,
    noError: !errMsg
  });
});

router.get('/checkitems', isLoggedIn, function(req,res, next){
  if(!req.session.cart){
    return res.redirect('/shopping-cart');
  }
  var products = Product.find({ user: req.user }, function(err,docs) {
    var productChunks = [];
    var chunkSize = 3;
    for( var i = 0; i < docs.length; i+= chunkSize){
      productChunks.push(docs.slice(i, i + chunkSize));
    }
   return res.render('user/items', {products: productChunks});
  });
});

router.get('/delete/:id', function(req, res, next) {
  var productId = req.params.id;
  Product.findByIdAndRemove({_id: productId}, (err, doc) => {
    if(err){
      console.log(err);
    }
  });
  res.redirect('/checkitems');
});

router.post('/additem', isLoggedIn, function(req,res,next){
  if(!req.session.cart){
    return res.redirect('/shopping-cart');
  }
  console.log(req.body);
  var price = parseInt(req.body.price, 10);
  //console.log(this.price);
  if(!checkURL(req.body.path)){
    req.flash('error', "Image not valid");
    return res.redirect('additem');
  }
  new Product({
    imagePath: req.body.path,
    title: req.body.itemname,
    description: req.body.description,
    price: price,
    user: req.user
  }).save((err, result) => {
    if(err){
      console.log(err);
      if(isNaN(price)){
        req.flash('error', "Invalid Price");
        return res.redirect('/additem');
      }
    }
    return res.redirect('/');
  });
});

router.post('/checkout', isLoggedIn, function(req,res,next){
  if(!req.session.cart){
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);

  var stripe = require("stripe")(
    "sk_test_EHmOFDup9rFd4nGO8KKZ2RY6"
  );
  
  stripe.charges.create({
    amount: cart.totalPrice * 100,
    currency: "usd",
    source: "tok_mastercard", // obtained with Stripe.js
    description: "Test Charge"
  }, function(err, charge) {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('/checkout');
    }
    var order = new Order({
      user: req.user,
      cart: cart,
      address: req.body.address,
      name: req.body.name,
      paymentId: charge.id
    });
    order.save(function(err, result) {
      if (err){
      req.flash('error', err.message);
      return res.redirect('/checkout');
      }
      req.flash('success', 'Successfully bought product!');
      req.session.cart = null;
      res.redirect('/');
    });
  });
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
      return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/user/signin');
}

function checkURL(url) {
  return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

module.exports = router;
