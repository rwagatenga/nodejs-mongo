//--Using MongoDB--
const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this.cart = cart;
    this._id = id
    //this._id = id ? new mongodb.ObjectId(id) : null;
  }
  /* Save new User or Update */
  save() {
    const db = getDb();
    return db.collection('users').insertOne(this);
    // let dbOp;
    // if (this._id) {
    //     dbOp = db.collection('user').updateOne({ _id: this._id }, { $set: this });
    // } else {
    //     dbOp = db.collection('user').insertOne(this);
    // }
    // return dbOp
    //     .then(result => {
    //         console.log(result);
    //         }).catch(err => {
    //         console.log(err);
    //     });
    }

    /* Add to Cart*/
    addToCart(product) {
	    // const cartProductIndex = this.cart.items.findIndex(cp => {
	    //   return cp.productId.toString() === product._id.toString();
	    // });
	    // let newQuantity = 1;
	    // const updatedCartItems = [...this.cart.items];

	    // if (cartProductIndex >= 0) {
	    //   newQuantity = this.cart.items[cartProductIndex].quantity + 1;
	    //   updatedCartItems[cartProductIndex].quantity = newQuantity;
	    // } else {
	    //   updatedCartItems.push({
	    //     productId: new ObjectId(product._id),
	    //     quantity: newQuantity
	    //   });
	    // }
	    // const updatedCart = {
	    //   items: updatedCartItems
	    // };
	    const updatedCart = {
	    	items: [
	    		{ productId: new mongodb.ObjectId(product._id), quantity: 1 }
	    	]
	    };
	    const db = getDb();
	    return db
	      .collection('users')
	      .updateOne(
	        { _id: new mongodb.ObjectId(this._id) },
	        { $set: { cart: updatedCart } }
	      );
  	}

    /* Fetch all Users */
    static fetchAll() {
        const db = getDb();
        return db.collection('users')
            .find()
            .toArray()
            .then(users => {
               console.log(users); 
               return users;
            }).catch(err => {
                console.log(err);
            });        
    }

    /* Fetch one User */
    static findById(userId) {
        const db = getDb();
        return db.collection('users')
            .findOne({ _id: new mongodb.ObjectId(userId) })
            .then(user => {
            	return user;
            })
            .catch(err => {
            	console.log(err);
            })
    }

    //---Delete User
    static deleteById(userId) {
      //   const db = getDb();
      //   return db
      //     .collection('users')
      //     .deleteOne({ _id: new mongodb.ObjectId(prodId) })
      //     .then(result => {
      //       console.log('Deleted');
      //     })
      //     .catch(err => {
      //       console.log(err);
      //     });
      }
}

module.exports = User;