import {fetch,fetchAll } from '../../lib/postgres.js'

const STEAKS = ` 
	SELECT * FROM STEAKS
	WHERE 
	CASE
		WHEN $1> 0 THEN steak_id = $1
		ELSE TRUE
	END
`

const INSERT_STEAK = ` 
	INSERT INTO steaks (
		steak_name,
		steak_price,
		steak_img
	) VALUES ($1,$2,$3)
	RETURNING *
`
const DELETE_STEAK = ` 
	DELETE FROM steaks WHERE steak_id=$1
	RETURNING *
`

const UPDATE_STEAK = ` 
	WITH old_data as (
		SELECT
			steak_id,
			steak_name,
			steak_price
		FROM steaks
		WHERE steak_id = $1
	) UPDATE steaks s SET
		steak_name = (
		CASE
			WHEN length($2) > 1 THEN $2
			ELSE o.steak_name
		END),
		steak_price = (
		CASE
			WHEN $3 > 0 THEN $3
			ELSE o.steak_price
		END)
	FROM old_data o
	WHERE s.steak_id = $1
	RETURNING s.steak_id, 
	s.steak_name as new_name, o.steak_name as old_name, 
	s.steak_price as new_price, o.steak_price as old_price
`

const steaks = ({steakId=0}) => {
	try {
		return fetchAll(STEAKS,steakId)
	} catch(e) {
		throw e
	}
}
const insertSteak = ({steakName, steakPrice=0, steakImg}) => {
	try {
		return  fetch(INSERT_STEAK,steakName,steakPrice,steakImg)
	} catch(e) {
		throw e
	}
}

const deleteSteak = ({steakId}) => {
	try {
		return  fetch(DELETE_STEAK,steakId)
	} catch(e) {
		throw e
	}
}

const updateSteak = ({steakId,steakName,steakPrice}) => {
	try {
		return  fetch(UPDATE_STEAK,steakId,steakName,steakPrice)
	} catch(e) {
		throw e
	}
}

export default {
	steaks,
	insertSteak,
	deleteSteak,
	updateSteak
}