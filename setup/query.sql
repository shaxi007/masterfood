select 
	case
		when o.table_id is not null and o.order_paid = true then false
		when o.table_id is null then false
		else true
	end as table_busy
from orders o
right join tables t on t.table_id = o.table_id
where t.table_id = 2
order by o.order_created_at desc
limit 1


select
	distinct on(t.table_id)
	t.table_id,
	t.table_number,
	case
		when o.order_paid = true then false
		else true
	end as table_busy
from tables t
inner join (
	select
		*
	from orders
	order by order_created_at desc
) as o on o.table_id = t.table_id
order by t.table_id;

SELECT 
	o.order_id,
	o.order_created_at,
	t.table_number,
	o.order_id,
	sum(os.price) as order_total_price,
	json_agg(os)
FROM orders o 
NATURAL JOIN tables t
INNER JOIN (
	SELECT
		os.order_set_id,
		os.count, 
		os.order_id,
		os.order_set_price*os.count price,
		row_to_json(s)
	FROM order_sets os
	NATURAL JOIN steaks s 
	GROUP BY os.order_set_id,s.*
) os ON os.order_id = o.order_id
GROUP BY o.order_id,t.table_number;


INSERT INTO steaks (
		steak_name,
		steak_price,
		steak_img
	) VALUES ('hads',200,'http')
	RETURNING *


WITH old_data as (
		SELECT
			steak_id,
			steak_name,
			steak_price
		FROM steaks
		WHERE steak_id = 1
	) UPDATE steaks s SET
		steak_name = (
		CASE
			WHEN length() > 1 THEN $2
			ELSE o.steak_name
		END),
		steak_price = (
		CASE
			WHEN 100 > 0 THEN 100
			ELSE o.steak_price
		END)
	FROM old_data o
	WHERE s.steak_id = 1
	RETURNING s.steak_id, 
	s.steak_name as new_name, o.steak_name as old_name, 
	s.steak_price as new_price, o.steak_price as old_price