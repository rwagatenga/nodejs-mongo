//--using Mongoose Driver--
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	resetToken: String,
  	resetTokenExpiration: Date,
	cart: {
		items: [
			{
				productId: {
					type: Schema.Types.ObjectId,
					ref: 'Product',
					required: true
				},
				quantity: {
					type: Number,
					required: true
				}
			}
		]
	}
})
/* Add to Cart */
userSchema.methods.addToCart = function(product) {
	const cartProductIndex = this.cart.items.findIndex(cp => {
	    return cp.productId.toString() === product._id.toString();
	});
	let newQuantity = 1;
	const updatedCartItems = [...this.cart.items];

	if (cartProductIndex >= 0) {
	    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
	    updatedCartItems[cartProductIndex].quantity = newQuantity;
	} else {
	    updatedCartItems.push({
		    productId: product._id,
		    quantity: newQuantity
	    });
	}
	const updatedCart = {
	    items: updatedCartItems
	};
	this.cart = updatedCart;
	return this.save();
};
/* Remove From Cart*/
userSchema.methods.removeFromCart = function(productId) {
	const updatedCartItems = this.cart.items.filter(item => {
		return item.productId.toString() !== productId.toString();
	});
	this.cart.items = updatedCartItems;
	return this.save();
};
/* Clear Cart Automatically*/
userSchema.methods.clearCart = function() {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
// //--Using MongoDB--
// const mongodb = require('mongodb');
// const getDb = require('../util/database').getDb;

// class User {
//   constructor(username, email, cart, id) {
//     this.username = username;
//     this.email = email;
//     this.cart = cart;
//     this._id = id
//     //this._id = id ? new mongodb.ObjectId(id) : null;
//   }
//   /* Save new User or Update */
//   save() {
//     const db = getDb();
//     return db.collection('users').insertOne(this);
//     // let dbOp;
//     // if (this._id) {
//     //     dbOp = db.collection('user').updateOne({ _id: this._id }, { $set: this });
//     // } else {
//     //     dbOp = db.collection('user').insertOne(this);
//     // }
//     // return dbOp
//     //     .then(result => {
//     //         console.log(result);
//     //         }).catch(err => {
//     //         console.log(err);
//     //     });
//     }

//     /* Add to Cart*/
//     addToCart(product) {
// 	    // const cartProductIndex = this.cart.items.findIndex(cp => {
// 	    //   return cp.productId.toString() === product._id.toString();
// 	    // });
// 	    // let newQuantity = 1;
// 	    // const updatedCartItems = [...this.cart.items];

// 	    // if (cartProductIndex >= 0) {
// 	    //   newQuantity = this.cart.items[cartProductIndex].quantity + 1;
// 	    //   updatedCartItems[cartProductIndex].quantity = newQuantity;
// 	    // } else {
// 	    //   updatedCartItems.push({
// 	    //     productId: new ObjectId(product._id),
// 	    //     quantity: newQuantity
// 	    //   });
// 	    // }
// 	    // const updatedCart = {
// 	    //   items: updatedCartItems
// 	    // };
// 	    const updatedCart = {
// 	    	items: [
// 	    		{ productId: new mongodb.ObjectId(product._id), quantity: 1 }
// 	    	]
// 	    };
// 	    const db = getDb();
// 	    return db
// 	      .collection('users')
// 	      .updateOne(
// 	        { _id: new mongodb.ObjectId(this._id) },
// 	        { $set: { cart: updatedCart } }
// 	      );
//   	}

//     /* Fetch all Users */
//     static fetchAll() {
//         const db = getDb();
//         return db.collection('users')
//             .find()
//             .toArray()
//             .then(users => {
//                console.log(users); 
//                return users;
//             }).catch(err => {
//                 console.log(err);
//             });        
//     }

//     /* Fetch one User */
//     static findById(userId) {
//         const db = getDb();
//         return db.collection('users')
//             .findOne({ _id: new mongodb.ObjectId(userId) })
//             .then(user => {
//             	return user;
//             })
//             .catch(err => {
//             	console.log(err);
//             })
//     }

//     //---Delete User
//     static deleteById(userId) {
//       //   const db = getDb();
//       //   return db
//       //     .collection('users')
//       //     .deleteOne({ _id: new mongodb.ObjectId(prodId) })
//       //     .then(result => {
//       //       console.log('Deleted');
//       //     })
//       //     .catch(err => {
//       //       console.log(err);
//       //     });
//       }
// }

// module.exports = User;