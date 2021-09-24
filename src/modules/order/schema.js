import { gql } from 'apollo-server'


export default gql`
	extend type Query {
		orders (orderId: ID tableId: ID pagination: Pagination): [Order!]!
	}
	extend type Mutation {
		addOrder(steakId: Int! tableId: Int! count: Int!): MutationResponse
		deleteOrder(orderId: Int!): MutationResponse
		deleteOrderSet(orderSetId: Int!): MutationResponse
		payOrder(tableId: Int!): MutationResponse
		updateOrder(orderSetId: Int! count: Int!): MutationResponse
	}
	type Order {
		orderId: ID!
		tableNumber: Int!
		orderPaid: Boolean!
		orderSets: [OrderSet]!
		orderCreatedAt: Date!
		orderPrice: Int!
	}

	type OrderSet {
		orderSetId: ID!
		steak: Steak!
		count: Int!
		price: Int!
	}
 `