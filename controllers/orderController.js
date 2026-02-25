import Order from "../models/order.js";

export function createOrder(req, res) {

    if (req.user == null) {
        res.status(403).json({
            message: "unauthorized access"
        })
        return
    }


    const body = req.body;
    const orderData = {

        orderId: "",
        email: req.user.email,
        name: body.name,
        address: body.address,
        phoneNumber: body.phoneNumber,
        billItems: [],
        total: 0

    }

    Order.find().sort({
        date: -1

    }).limit(1).then((lastBills) => {
        if (lastBills.length == 0) {   //if no order exist in database//first order id will be ORD0001
            orderData.orderId = "ORD0001"
        } else {
            const lastBill = lastBills[0]; //if have bill(last order) lastbilles means last order id
            const lastOrderId = lastBill.orderId; //get last order id "ORD0063"
            const lastOrderIdNumber = lastOrderId.replace("ORD", "") //ORD0063 => 0063 remove ORD and get number part (this is String convert to nummber 0063 to 63)
            const lastOrderNumberInt = parseInt(lastOrderIdNumber);  //convert 0063 to integer 63
            const newOrderNumberInt = lastOrderNumberInt + 1; //add 1 to get new order number 64
            const newOrderNumberString = newOrderNumberInt.toString().padStart(4, "0"); //convert 64 to string and pad with leading zeros to make it 4 digits "0064"
            orderData.orderId = "ORD" + newOrderNumberString; //combine "ORD" with new order number to get new order id "ORD0064"
        }
        for (let i = 0; i < body.billItems.length; i++) {
            const billItem = body.billItems[i];
            
        }

        const order = new Order(orderData) //create order object with order data


        order.save()  //save order to database
            .then(() => {
                res.status(200).json({
                    message: "Order Created Successfully",
                    orderId: orderData.orderId
                })
            })
            .catch((error) => {
                res.status(500).json({
                    message: "Error to Create Order"
                })
            })


    })

}

export function getOrders(req, res) {
    if(req.user == null){
        res.status(403).json({
            message:"unauthorized access"
        })
        return
    }
    if(req.user.role == "admin"){
        Order.find().then((orders)=>{
            res.status(200).json({
                message:"Orders Fetched Successfully",
                orders: orders
            })
        }).catch((error)=>{
            res.status(500).json({
                message:"Error to Fetch Orders"
            })
        })

}else{
    Order.find({
        email: req.user.email
    }).then((orders)=>{
        res.status(200).json({
            message:"Orders Fetched Successfully",
            orders: orders
        })
    }).catch((error)=>{
        res.status(500).json({
            message:"Error to Fetch Orders"
        })
    })
}
}
