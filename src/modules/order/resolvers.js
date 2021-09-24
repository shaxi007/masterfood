import model from './model.js'

export default {
	Query : {
		orders: async (_,args)=> {
			console.log(await model.orders(args))
			return await model.orders(args)
		}

	},	
	Mutation : {
		addOrder:  async (_,args)=> {
			try {
				let order = await model.insertOrder(args)
				if(order){
					return {
						status: 201,
						message: 'The new order has ben added',
						data: order
					}
				}else throw new Error('This table is busy')
			} catch(e) {
				return {
					status:400,
					message:e,
					data:null
				}
			}
		},
		deleteOrder: async (_,args)=>{
			try {
				let order = await model.deleteOrder(args) 
				if(order){
					return {
						status: 201,
						message: 'The  order has ben deleted',
						data: order
					}
				}else throw new Error('There is an Error')
			} catch(e) {
				return {
					status:400,
					message:e,
					data:null
				}
			}
		},
		updateOrder: async (_,args)=>{
			try {
				let order = await model.updateOrder(args) 
				if(order){
					return {
						status: 201,
						message: 'The  order has ben updated',
						data: order
					}
				}else throw new Error('There is an Error')
			} catch(e) {
				return {
					status:400,
					message:e,
					data:null
				}
			}
		},
		payOrder: async (_,args)=>{
			try {
				let order = await model.payOrder(args) 
				if(order){
					return {
						status: 201,
						message: 'ok',
						data: order
					}
				}else throw new Error('There is an Error')
			} catch(e) {
				return {
					status:400,
					message:e,
					data:null
				}
			}
		},
		deleteOrderSet: async (_,args)=>{
			try {
				let order = await model.deleteOrderSet(args) 
				if(order){
					return {
						status: 201,
						message: 'The new order has ben added',
						data: order
					}
				}else throw new Error('There is an Error')
			} catch(e) {
				return {
					status:400,
					message:e,
					data:null
				}
			}
		}
	}
	,
	Order: {
		orderId : global=> global.order_id,
		tableNumber: global=> global.table_number,
		orderPaid: global=> global.order_paid,
		orderSets: global=> global.order_sets,
		orderCreatedAt: global=> global.order_created_at,
		orderPrice: global=> global.order_total_price 
	},
	OrderSet: {
		orderSetId: global => global.order_set_id		
	}
}