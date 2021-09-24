import {fetch,fetchAll } from '../../lib/postgres.js'

const ORDERS = ` 
	SELECT 
		o.order_id,
		o.order_created_at,
		t.table_number,
		o.order_id,
		o.order_paid,
		sum(os.price) as order_total_price,
		json_agg(os) order_sets
			FROM orders o 
			NATURAL JOIN tables t
			INNER JOIN (
				SELECT
					os.order_set_id,
					os.count, 
					os.order_id,
					os.order_set_price*os.count price,
					row_to_json(s) steak
				FROM order_sets os
				NATURAL JOIN steaks s 
				GROUP BY os.order_set_id,s.*
	) os ON os.order_id = o.order_id
	WHERE  
	CASE
		WHEN $1>0 THEN  o.order_id = $1
		ELSE TRUE
	END AND 
	CASE
		WHEN $2>0 THEN  t.table_id = $2
		ELSE TRUE
	END
	GROUP BY o.order_id,t.table_number
	OFFSET $3
	LIMIT $4
	;
`

const ORDERS_ALL = ` 
	SELECT 
		o.order_id,
		o.order_created_at,
		t.table_number,
		o.order_id,
		o.order_paid,
		sum(os.price) as order_total_price,
		json_agg(os) order_sets
			FROM orders o 
			NATURAL JOIN tables t
			INNER JOIN (
				SELECT
					os.order_set_id,
					os.count, 
					os.order_id,
					os.order_set_price*os.count price,
					row_to_json(s) steak
				FROM order_sets os
				NATURAL JOIN steaks s 
				GROUP BY os.order_set_id,s.*
	) os ON os.order_id = o.order_id
	WHERE  
	CASE
		WHEN $1>0 THEN  o.order_id = $1
		ELSE TRUE
	END AND 
	CASE
		WHEN $2>0 THEN  t.table_id = $2
		ELSE TRUE
	END
	GROUP BY o.order_id,t.table_number
	;
`

const INSERT_ORDER = `
	INSERT INTO orders (
		table_id
	) VALUES ($1)
	RETURNING order_id
`

const INSERT_ORDER_SET = `
	INSERT INTO order_sets (
		order_id,
		steak_id,
		count,
		order_set_price
	) select $1, $2, $3, s.steak_price from steaks s
	where s.steak_id = $2
	RETURNING *
`

const CHECK_TABLE = `
	select 
		o.order_id,
		case
			when o.table_id is not null and o.order_paid = true then false
			when o.table_id is null then false
			else true
		end as table_busy
	from orders o
	right join tables t on t.table_id = o.table_id
	where t.table_id = $1
	order by o.order_created_at desc
	limit 1
`

const PAY_ORDER = `
	UPDATE orders SET 
		order_paid = true
	WHERE table_id = $1
	RETURNING *
`

const DELETE_ORDER_SET = `
	DELETE FROM order_sets
	WHERE order_set_id = $1
	RETURNING *
`

const DELETE_ORDER = `
	DELETE FROM orders
	WHERE order_id = $1
	RETURNING *
`

const PUT_ORDER = `
	WITH old_data as (
		SELECT
			count
		FROM order_sets
		WHERE order_set_id = $1
	) UPDATE order_sets os SET
		count = old_data.count + $2
	FROM old_data
	WHERE order_set_id = $1
	RETURNING os.*
`

const orders = ({orderId=0,tableId =0,pagination=[]}) => {
	let {page,limit} = pagination
	if(!page || !limit) return fetchAll(ORDERS_ALL,orderId,tableId)
	return fetchAll(ORDERS,orderId,tableId,(page-1)*limit,limit)
}

const insertOrder = async ({ steakId, tableId, count }) => {
	let [{table_busy}] = await fetchAll(CHECK_TABLE, tableId)
	if(!table_busy) {
		let [newOrder] = await fetchAll(INSERT_ORDER, tableId)
		let [newOrderSet] = await fetchAll(INSERT_ORDER_SET, newOrder.order_id, steakId, count )
		return newOrderSet
	} else {
		return null
	}
}

const payOrder = async ({ tableId }) => {
	return fetchAll(PAY_ORDER, tableId)
}

const deleteOrderSet = async ({ orderSetId }) => {
	return fetch(DELETE_ORDER_SET, orderSetId)
}

const deleteOrder = async ({ orderId }) => {
	return fetch(DELETE_ORDER, orderId)
}

const updateOrder = async ({ orderSetId, count }) => {
	return fetch(PUT_ORDER, orderSetId, count)
}

export default {
	orders,
	insertOrder,
	payOrder,
	deleteOrderSet,
	updateOrder,
	deleteOrder
}





