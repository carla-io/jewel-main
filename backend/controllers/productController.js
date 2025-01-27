const Product = require ('../models/product');
const cloudinary = require('cloudinary');

exports.newProduct = async (req, res) => {
    try {
        console.log(req.files); // Debugging line
        console.log(req.body); // Debugging line

        if (!req.files || !req.files.length) {
            return res.status(400).json({
                success: false,
                message: 'No images provided',
            });
        }

        const { name, category, price, description } = req.body;
        let imagesLinks = [];

        for (let i = 0; i < req.files.length; i++) {
            try {
                const result = await cloudinary.v2.uploader.upload(req.files[i].path, {
                    folder: 'products',
                    width: 150,
                    crop: "scale",
                });

                imagesLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url
                });
            } catch (error) {
                console.log(error);
                return res.status(500).json({
                    success: false,
                    message: 'Image upload failed',
                    error: error.message,
                });
            }
        }

        const product = new Product({
            name,
            category,
            price,
            description,
            images: imagesLinks,
            // user: req.user.id
        });

        await product.save();

        return res.status(201).json({
            success: true,
            product,
        });
    } catch (error) {
        return res.status(400).json({ 
            success: false,
            message: error.message 
        });
    }
};

exports.getProducts = async (req, res) => {
    try {
        // Fetch all products from the database
        const products = await Product.find();

        // Check if products exist
        if (!products || products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No products found',
            });
        }

        const productsWithImages = products.map(product => {
            const imageUrl = cloudinary.url(product.image_public_id, {
                width: 500,
                height: 500,
                crop: 'fill',
            });
            return { ...product.toObject(), image: imageUrl };
        });

        // Return products in response
        return res.status(200).json({
            success: true,
            products: productsWithImages,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getSingleProduct = async (req, res, next) => {
    try {
        // Find the product by ID from the request parameters
        const product = await Product.findById(req.params.id);

        // Check if the product exists
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        // Return the found product
        return res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { name, price, description, category } = req.body;
        const productId = req.params.id;

        // Find the product by ID
        let product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Step 1: Handle image updates if new images are provided
        let images = product.images; // Keep the existing images if no new ones are provided
        if (req.files && req.files.length > 0) {
            // Clear existing images if new ones are uploaded
            images = [];

            // Upload each new image to Cloudinary
            for (const file of req.files) {
                const result = await cloudinary.v2.uploader.upload(file.path, {
                    folder: 'products',
                    crop: 'scale'
                });

                // Add the uploaded image to the images array
                images.push({
                    public_id: result.public_id,
                    url: result.secure_url
                });
            }
        }

        // Step 2: Update the product fields with the provided data
        product.name = name || product.name;
        product.price = price || product.price;
        product.description = description || product.description;
        product.category = category || product.category;
        product.images = images; // Update images if provided

        // Step 3: Save the updated product to the database
        await product.save();

        return res.status(200).json({
            success: true,
            product
        });

    } catch (error) {
        console.error("Error during product update:", error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};


exports.deleteProduct = async (req, res, next) => {
    try {
        // Step 1: Find the product by ID
        const product = await Product.findById(req.params.id);

        // Step 2: If product is not found, return 404 error
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        // Step 3: Delete images from Cloudinary
        if (product.images && product.images.length > 0) {
            for (let i = 0; i < product.images.length; i++) {
                await cloudinary.uploader.destroy(product.images[i].public_id);
            }
        }

        // Step 4: Delete the product from the database
        await Product.findByIdAndDelete(req.params.id);

        // Step 5: Return success response
        return res.status(200).json({
            success: true,
            message: 'Product and associated images deleted successfully',
        });
        
    } catch (error) {
        // Handle any errors that occur
        console.error("Error deleting product:", error.message);
        return res.status(500).json({
            success: false,
            message: 'Server error, could not delete product',
        });
    }
};







