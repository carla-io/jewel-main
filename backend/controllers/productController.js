const Product = require ('../models/product');
const cloudinary = require('cloudinary').v2;


exports.newProduct = async (req, res, next) => {
    try {
        console.log("Request Body:", req.body);
        console.log("Uploaded Files:", req.files);

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: "No images uploaded" });
        }

        let imagesLinks = [];

        // Function to upload image buffer to Cloudinary
        const uploadImage = (fileBuffer) => {
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "products", width: 150, crop: "scale" },
                    (error, result) => {
                        if (error) {
                            console.error("Cloudinary Upload Error:", error);
                            reject(error);
                        } else {
                            resolve({
                                public_id: result.public_id,
                                url: result.secure_url,
                            });
                        }
                    }
                );
                uploadStream.end(fileBuffer); // Send buffer to Cloudinary
            });
        };

        // Upload all images
        for (let file of req.files) {
            try {
                const uploadedImage = await uploadImage(file.buffer);
                imagesLinks.push(uploadedImage);
            } catch (error) {
                console.log(error);
            }
        }

        req.body.images = imagesLinks;
        // req.body.user = req.user.id;

        const product = await Product.create(req.body);

        if (!product) {
            return res.status(400).json({ success: false, message: "Product not created" });
        }

        return res.status(201).json({ success: true, product });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error" });
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
                message: "No products found",
            });
        }

        // Ensure correct image retrieval
        const productsWithImages = products.map(product => {
            return {
                ...product.toObject(),
                image: product.images.length > 0 ? product.images[0].url : null, // ✅ Correctly gets the first image URL
            };
        });

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
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // ✅ Only update images if new ones are uploaded
        if (req.files && req.files.length > 0) {
            // Clear old images
            for (const image of product.images) {
                await cloudinary.v2.uploader.destroy(image.public_id);
            }
            
            product.images = []; // Reset images array

            for (const file of req.files) {
                const result = await cloudinary.v2.uploader.upload(file.path, {
                    folder: 'products',
                    crop: 'scale'
                });

                product.images.push({ public_id: result.public_id, url: result.secure_url });
            }
        }

        // Update fields
        product.name = name || product.name;
        product.price = price || product.price;
        product.description = description || product.description;
        product.category = category || product.category;

        await product.save();

        return res.status(200).json({ success: true, product });

    } catch (error) {
        console.error("Error during product update:", error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
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







