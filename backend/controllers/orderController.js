const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');
const User = require('../models/user'); // Ensure user validation

exports.createOrder = async (req, res) => {
    const { orderItems, shippingInfo, itemsPrice, taxPrice, shippingPrice, totalPrice, modeOfPayment, userId } = req.body;

    if (!orderItems || orderItems.length === 0) {
        return res.status(400).json({ message: 'No order items found' });
    }
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!['COD', 'Online Payment'].includes(modeOfPayment)) {
            return res.status(400).json({ message: 'Invalid mode of payment. Must be COD or Online Payment.' });
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const bulkOps = [];

            for (let item of orderItems) {
                const product = await Product.findById(item.product).session(session);
                if (!product) {
                    await session.abortTransaction();
                    return res.status(404).json({ message: `Product with ID ${item.product} not found.` });
                }
                if (product.stock < item.quantity) {
                    await session.abortTransaction();
                    return res.status(400).json({ message: `Insufficient stock for product ${product.name}.` });
                }

                bulkOps.push({
                    updateOne: {
                        filter: { _id: item.product },
                        update: { $inc: { stock: -item.quantity } } // ✅ FIXED: Use $inc correctly
                    }
                });
            }

            const order = new Order({
                userId,
                orderItems,
                shippingInfo,
                modeOfPayment,
                status: 'Processing',
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice
            });

            await order.save({ session });

            if (bulkOps.length > 0) {
                await Product.bulkWrite(bulkOps, { session }); // ✅ FIXED: Proper bulkWrite usage
            }

            await session.commitTransaction();
            session.endSession();

            res.status(201).json({ message: 'Order placed successfully', order });
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            console.error('Transaction error:', error);
            res.status(500).json({ message: 'Order processing failed' });
        }
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('orderItems.product')   // Populating product details
            .populate('userId', 'name email'); // Populating user details

        console.log('Fetched Orders:', orders); // Log the fetched orders to check

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found.' });
        }

        res.status(200).json({ orders }); // Send orders wrapped in an object
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.updateOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    // Validate the status value
    if (!['Processing', 'Completed', 'Canceled'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value. Must be Processing, Completed, or Canceled.' });
    }

    try {
        // Find and update the order's status
        const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        res.status(200).json({ message: 'Order status updated successfully.', order: updatedOrder });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.deleteOrder = async (req, res) => {
    const { orderId } = req.params;

    try {
        // Find and delete the order
        const deletedOrder = await Order.findByIdAndDelete(orderId);

        if (!deletedOrder) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        res.status(200).json({ message: 'Order deleted successfully.' });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};


exports.getMonthlySales = async (req, res) => {
    try {
        const salesData = await Order.aggregate([
            {
                $match: {
                    status: 'Completed', // Only consider completed orders
                }
            },
            {
                $group: {
                    _id: { 
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    totalSales: { $sum: "$totalPrice" }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 } // Sort by year and month
            }
        ]);

        if (!salesData || salesData.length === 0) {
            return res.status(404).json({ message: 'No sales data found.' });
        }

        res.status(200).json({ salesData });
    } catch (error) {
        console.error('Error fetching monthly sales data:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getUserOrder = async (req, res) => {
    const { userId, status } = req.query;

    try {
        // Construct the query object
        const query = {};
        if (userId) query.userId = userId; // Filter by userId
        if (status) query.status = status; // Filter by order status

        const orders = await Order.find(query)
            .populate('orderItems.product') // Populate product details
            .populate('userId', 'name email'); // Populate user details

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found.' });
        }

        // Flatten the orders to have one product per row
        const formattedOrders = orders.flatMap(order =>
            order.orderItems.map(item => ({
                orderId: order._id,
                product: item.product, // Populated product details
                quantity: item.quantity,
                totalPrice: order.totalPrice,
                user: order.userId, // Populated user details
                status: order.status,
                createdAt: order.createdAt,
            }))
        );

        res.status(200).json({ orders: formattedOrders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};







