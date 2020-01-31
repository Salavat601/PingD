export const NEW_EVENT = 'NEW_EVENT';
export function newEvent(event) {
	return {
		type: NEW_EVENT,
		payload: {
			event: event,
		},
	};
}

export const DELETE_EVENT = 'DELETE_EVENT';
export function deleteEvent(event) {
	return {
		type: DELETE_EVENT,
		payload: {
			event: event,
		},
	};
}