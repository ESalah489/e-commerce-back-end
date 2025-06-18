// import express from "express";
// const router = express.Router();
// import { isAuth } from "../../middleware/isauthMiddleware.js";
// import validate from "../../middleware/validationMiddleware.js";
// import { orderValidationSchema } from "../../modules/Order/order.validation.js";

// import {
//   CkeckoutOrder,
//   GetAllOrders,
// } from "../../modules/Order/order-controller.js";

// router.post(
//   "/checkout",
//   isAuth,
//   validate(orderValidationSchema),
//   CkeckoutOrder
// );

// router.get("/orders", isAuth, GetAllOrders);

// export default router;



import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import Order from '../../../DB/models/checkout-model.js';
import { orderValidationSchema } from './order.validation.js';
import { placeOrder } from './order-controller.js';

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const allowedStatuses = ["pending", "processing", "shipped", "delivered", "cancelled", "completed"];

router.get('/', (req, res) => {
  res.json({ message: '✅ Orders route is working' });
});

router.get('/all', async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user')
      .populate('items.product');

    res.status(200).json({ orders });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { error } = orderValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { user, items, shippingAddress, phoneNumbers, totalAmount } = req.body;

    const newOrder = new Order({
      user,
      items,
      shippingAddress,
      phoneNumbers,
      totalAmount,
      status: [{ step: 'pending', time: new Date() }],
      deliveryStatus: 'pending',
    });

    await newOrder.save();

    res.status(201).json({
      message: 'Order placed successfully!',
      orderId: newOrder._id,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/checkout', placeOrder);

router.post('/create-checkout-session', async (req, res, next) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Product Name' },
            unit_amount: 2000,
          },
          quantity: 1,
        },
      ],
      // success_url: `${process.env.BASE_URL}/complete`,
      // cancel_url: `${process.env.BASE_URL}/cancel`,
      success_url: `${process.env.BASE_URL}/complete?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${process.env.BASE_URL}/cancel`,
  metadata: {
    orderId: newOrder._id.toString(),
    userId: user
  }
    });

    // res.redirect(303, session.url);
    res.status(200).json({ url: session.url });

  } catch (error) {
    next(error);
  }
});

router.get('/complete', (req, res) => {
  res.send('Payment successful!');
});

router.get('/cancel', (req, res) => {
  res.send('Payment canceled.');
});


router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Allowed statuses: ${allowedStatuses.join(', ')}` });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

   
    order.status.push({ step: status, time: new Date() });

 
    order.deliveryStatus = status;

    await order.save();

    res.json({
      message: `Order status updated to '${status}'`,
      status: order.status,
      deliveryStatus: order.deliveryStatus,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    console.log('💥 webhook hit');

  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata.userId;
    const orderId = session.metadata.orderId;

    // ✅ Check if order already exists
    const existingOrder = await Order.findById(orderId);
    if (existingOrder && existingOrder.deliveryStatus !== 'pending') {
      console.log('⚠️ Order already processed via Webhook');
      return res.status(200).json({ received: true });
    }

    // ✅ Update existing order status (if created previously)
    if (existingOrder) {
      existingOrder.status.push({ step: 'paid', time: new Date() });
      existingOrder.deliveryStatus = 'processing';
      await existingOrder.save();
      console.log('✅ Existing order updated via webhook');
    } else {
      // ✅ Or create a new order if not found
      const newOrder = new Order({
        user: userId,
        items: [], // optionally add items
        shippingAddress: {},
        phoneNumbers: [],
        totalAmount: session.amount_total / 100,
        status: [{ step: 'paid', time: new Date() }],
        deliveryStatus: 'processing',
      });
      await newOrder.save();
      console.log('✅ New order saved from webhook');
    }
  }

  res.status(200).json({ received: true });
});


export default router;
