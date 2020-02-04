const _ = require('lodash');
import * as EventActions from '../actions/eventActions';
import {Event} from '../../models/eventManager';
import * as NotificationManager from '../actions/notificationManager';

const initialState = {
	events: [],
};

export default function events(contactsState = initialState, action) {
	switch (action.type) {
		case EventActions.NEW_EVENT: {
			const newState = _.cloneDeep(contactsState);
			const {payload} = action;
			let {event} = payload;

			let eventId = newState.events.length;
			if (newState.events.length > 0) {
				const lastEvent = newState.events[newState.events.length - 1];
				eventId = (parseInt(lastEvent.eventId) + 1).toString();
			}
			event.eventId = eventId;
			newState.events.push(event);

			NotificationManager.registerEvent(event);

			console.log('Event Added: ', event);

			return newState;
		}

		case EventActions.DELETE_EVENT: {
			const newState = _.cloneDeep(contactsState);
			const {payload} = action;
			const {event} = payload;

			newState.events = newState.events.filter(
				item => item.eventId !== event.eventId,
			);

			NotificationManager.cancelEvent(event);

			return newState;
		}

		default:
			return contactsState;
	}
}
