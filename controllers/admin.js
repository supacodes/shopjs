const {
	validationResult
} = require('express-validator');

const Product = require("../models/product");


exports.getAddProduct = (req, res, next) => {



	res.render("admin/add-product", {
		pageTitle: "Add Product",
		activeLink: "/admin/add-product",
		oldValues: {
			name: '',
			price: '',
			description: '',
			imageUrl: ''
		},
		errorMsg: '',
		validationErrors: []
	});
};

exports.postAddProduct = (req, res, next) => {

	const post = req.body;
	const name = post.name;
	const price = post.price;
	const description = post.description;
	const imageUrl = post.imageUrl;

	const errors = validationResult(req);


	if (!errors.isEmpty()) {
		return res.status(422).render("admin/add-product", {
			pageTitle: "Add Product",
			activeLink: "/admin/add-product",
			oldValues: {
				name,
				price,
				description,
				imageUrl
			},
			errorMsg: errors.array()[0].msg,
			validationErrors: errors.array()
		});
	}


	const product = new Product({
		name,
		price,
		description,
		imageUrl,
		userId
	});

	product.save()
		.then(product => {
			res.redirect(`/admin/products#${product._id}`);
		})
		.catch(err => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
	const id = req.params.id;
	Product.findById(id)
		.then(product => {
			res.render("admin/edit-product", {
				pageTitle: "Edit Product",
				activeLink: "/admin/edit-product",
				product
			});
		})
		.catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
	const id = req.body.productId;
	const name = req.body.name;
	const price = req.body.price;
	const description = req.body.description;
	const imageUrl = req.body.imageUrl;


	Product.findOne({
			_id: id,
			userId: req.user._id
		})
		.then(product => {
			if (!product) {
				return res.redirect('/admin/products')
			}
			product.name = name;
			product.price = price;
			product.description = description;
			product.imageUrl = imageUrl;
			return product.save();
		})
		.then(() => {
			res.redirect(`/admin/products#${id}`);
		})
		.catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
	Product.find({
			userId: req.user._id
		})
		.then(products => {
			res.render("admin/products", {
				products,
				pageTitle: "Admin Products",
				activeLink: "/admin/products"
			});
		})
		.catch(err => console.log(err));
};
exports.postDeleteProduct = (req, res, next) => {
	const id = req.body.productId;

	Product.deleteOne({
			_id: id,
			userId: req.user._id
		})
		.then(() => {
			res.redirect("/admin/products");
		})
		.catch(err => console.log(err));
};