import model from './model.js'

export default {
	Query: {
		tables: async ()=> await model.tables()
	},
	Mutation: {
		deleteTable: async (_,args)=>{
			try {
				let table = await model.deleteTable(args)
				if(table) {
					return {
						status: 201,
						message: 'The table has ben deleted',
						data: table
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
		addTable: async (_,args)=>{
			try {
				let table = await model.addTable(args)
				if(table) {
					return {
						status: 201,
						message: 'The new table has ben added',
						data: table
					}
				}else throw new Error('not found')
			} catch(e) {
				return {
					status:400,
					message:e.message,
					data:null
				}
			}
		}
	},
	Table: {
		tableId:  global=> global.table_id,
		tableNumber: global=> global.table_number,
		tableBusy: global=> global.table_busy,
		order: async global=> {
			return global.table_busy ? await model.order(global.table_id) : null
		}
	}
}