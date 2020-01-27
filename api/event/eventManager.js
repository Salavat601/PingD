import React, { Component } from 'react';
import EventTypes from './eventTypes';
import moment from 'moment';

const format = "YYYY-MM-DD";

export default class EventManager {
	static sharedInstance = EventManager.instance || new EventManager();

	static events = [];

	addEvent(typeIndex, comment, date) {
		if (!comment || comment == "" || !date) {
			return false;
		}

		const event = {
			index: typeIndex,
			date: date,
			comment: comment,
			ref: EventTypes.event(typeIndex)
		}
		EventManager.events.push(event);
		console.log('event added')

		return true;
	}

	eventWithDate(date) {
		let results = [];
		const strDate = moment(date).format(format);
		EventManager.events.map((item, index) => {
			const strItemDate = moment(item.date).format(format);
			if (strDate == strItemDate) {
				results.push(item);
			}
		})

		return results;
	}

	allDates() {
		let results = [];
		for (var i = 0; i < EventManager.events.length; i++) {
			const strItemDate = moment(EventManager.events[i].date).format(format);

			let found = false;
			for (var j = 0; j < results.length; j++) {
				const strDate = moment(results[j]).format(format);
				if (strItemDate == strDate) {
					found = true;
					break;
				}
			}

			if (!found) {
				results.push(EventManager.events[i].date);
			}
		}
		return results;
	}
}