import model from './model.js'

export default {
	Query: {
		steaks: async (_,args)=> await model.steaks(args)
	},
	Mutation: {
		addSteak: async (_,args)=> {
			try {
				let steak = await model.insertSteak(args) 
				if(steak){
					return {
						status: 201,
						message: 'The new steak has ben added',
						data: steak
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
		deleteSteak: async (_,args)=>{
			try {
				let steak = await model.deleteSteak(args)
				if(steak) {
					return {
						status: 201,
						message: 'The steak has ben deleted',
						data: steak
					}
				}else throw new Error('not found')
			} catch(e) {
				return {
					status:400,
					message:e.message,
					data:null
				}
			}
		},
		updateSteak: async (_,args)=>{
			try {
				let steak = await model.updateSteak(args)
				if(steak) {
					return {
						status: 201,
						message: 'The steak has ben deleted',
						data: steak
					}
				}else throw new Error('not found')
			} catch(e) {
				return {
					status:400,
					message:e,
					data:null
				}
			}
		}
	},
	Steak: {
		steakId:  global=> global.steak_id,
		steakName: global=> global.steak_name,
		steakPrice: global=> global.steak_price,
		steakImg: global=> global.steak_img
	}
}