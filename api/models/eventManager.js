import React, { Component } from 'react';
import EventTypes, { EventType } from './eventTypes';
import moment from 'moment';
import { checkPermission } from 'react-native-contacts';

const format = "YYYY-MM-DD";

export const Event = (props) => {
	const { index, date, comment } = props;

	return (
		{
			eventId: "0",
			index: index,
			date: date,
			comment: comment,
			typeRef: EventTypes.event(index),
		}
	)
}

export default class EventManager {
	static sharedInstance = EventManager.instance || new EventManager()

	static eventWithDate(events, date) {
		let results = [];
		const strDate = moment(date).format(format);
		events.map((item, index) => {
			const strItemDate = moment(item.date).format(format);
			if (strDate == strItemDate) {
				results.push(item);
			}
		})

		return results;
	}

	static allDates(events) {
		let results = [];
		for (var i = 0; i < events.length; i++) {
			const strItemDate = moment(events[i].date).format(format);

			let found = false;
			for (var j = 0; j < results.length; j++) {
				const strDate = moment(results[j]).format(format);
				if (strItemDate == strDate) {
					found = true;
					break;
				}
			}

			if (!found) {
				results.push(events[i].date);
			}
		}
		return results;
	}
}