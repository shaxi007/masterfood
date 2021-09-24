import { gql } from 'apollo-server'

export default gql`
	scalar Date
	scalar Any

	input Pagination {
		page: Int!
		limit: Int!
	}

	type MutationResponse {
		status: Int!
		message: String!
		data: Any!
	}
 `