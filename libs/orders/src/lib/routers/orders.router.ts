import * as express from "express";
import {OrderItem} from '../Schemas/order-item.schema';
import {Order} from '../Schemas/order.schema'
const router = express.Router();


router.get(`/`, async (req, res) => {
  const ordersList = await Order.find()
    .populate("user", "name")
    .sort({ dateOrdered: -1 });
  res.send(ordersList);
  if (!ordersList) {
    res.status(500).json(orderError(500, 'orders not found'));
  }
});

router.get(`/allData`, async (req, res) => {
  const ordersList = await Order.find()
    .populate("user", "name")
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: "category",
      },
    })
    .sort({ dateOrdered: -1 });
  res.send(ordersList);
  if (!ordersList) {
    res.status(500).json(orderError(500, 'orders not found'));
  }
});

router.get(`/:id`, async (req, res) => {
  const ordersList = await Order.findById(req.params.id)
    .populate("user", "name")
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: "category",
      },
    })
    .sort({ dateOrdered: -1 });
  res.send(ordersList);
  if (!ordersList) {
    res.status(500).json(orderError(500, 'orders not found'));
  }
});

router.get(`/get/userOrders/:id`, async (req, res) => {
    const ordersList = await Order.find({user: req.params.id})
      .populate({
        path: "orderItems",
        populate: {
          path: "product",
          populate: "category",
        },
      })
      .sort({ dateOrdered: -1 });

    if (!ordersList) {
      res.status(500).json(orderError(500, 'orders not found'));
    }
    res.status(200).send({
        orders:ordersList,
        success: true
    });
  });


router.get("/get/count", async (req, res) => {
    const orderCount = await Order.countDocuments();
    if (!orderCount) {
      return res.status(404).json(orderError(404, "Orders not Found!"));
    }

    res.status(200).send({
      orderCount: orderCount,
      success: true,
    });
  });

  //total sales
router.get('/get/totalsales', async (req,res)=>{
    const totalSales = await Order.aggregate([
        //find sum of all totalPrice
        {$group: {_id: null, totalsales: {$sum: '$totalPrice'}}}
    ])

    if(!totalSales){
        return res.status(400).json(orderError(400, 'The order sales cannot be generated'))
    }

    res.status(200).json({
        totalSales: totalSales.pop().totalsales,
        success: true
    })
})

router.post(`/`, async (req, res) => {
  const orderItemIds = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });

      newOrderItem = await newOrderItem.save();

      return newOrderItem._id;
    })
  );

  const orderItemIdsResolved = await orderItemIds;

  const totalPrices = await Promise.all( orderItemIdsResolved.map(async (orderItemId)=>{
      const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
      console.log(orderItem)
      const totalPrice = orderItem.quantity * orderItem.product.price;
      return totalPrice;
  }))
  console.log(totalPrices)

  const totalPrice = totalPrices.reduce((a,b)=> a + b, 0);

  let order = new Order({
    orderItems: orderItemIdsResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    state: req.body.state,
    country: req.body.country,
    zip: req.body.zip,
    status: req.body.status,
    totalPrice: totalPrice,
    user: req.body.user,
    dateOrdered: req.body.dateOrdered,
    phone: req.body.phone,
  });
  order = await order.save();
  if (!order) {
    return res.status(500).send(orderError(500, "Order not placed"));
  }

  res.status(201).send({
    order: order,
    success: true,
    message: "Order placed!",
  });
});

router.put("/:id", async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    { new: true }
  );

  if (!order) {
    return res.status(500).send(orderError(500, "Order not placed!"));
  }

  res.status(201).send({
    order: order,
    success: true,
  });
});

router.delete("/:id", async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) {
    return res.status(500).send(orderError(500, "Order not found!"));
  } else {
    const orderItemIds = Promise.all(
      order.orderItems.map(async (orderItemId) => {
        const deletedId = await OrderItem.findByIdAndDelete(orderItemId);
        if (!deletedId) {
          return res
            .status(500)
            .send(orderError(500, "Order item delete failed!"));
        }
        return deletedId;
      })
    );
    const deletedIds = await orderItemIds;

    res.status(201).send({
      order: order,
      deletedOrderItemIds: deletedIds,
      message: "Order was deleted!",
      success: true,
    });
  };
});



function orderError(code, message) {
  return {
    code: code,
    message: message,
    success: false,
  };
}


//  {
//      "orderItems": [
//          {
//              "quanitity": 3,
//              "product": "61f4865c747816e40f0dfa54"
//          },
//          {
//                  "quanitity": 2,
//                  "product": "61f4868bcbe0723cb8950889"
//           },
//           {
//             "quanitity": 1,
//             "product": "61f4868fcbe0723cb895088c"
//      }
//      ],
//      "shippingAddress1":"123 4th st",
//      "shippingAddress2":"411a",
//      "city":"mesa",
//      "state":"Az",
//      "zip": "85213",
//      "country": "USA",
//      "user":"61f493513a886bdc57b603df"
//  }

export default router;
