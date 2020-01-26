import React, { Component } from 'react';
import { Image } from 'react-native';
import PropTypes from 'prop-types';

const all = [
	{
		title: 'Friend Milestone',
		icon: require('../assets/calendar_add.png'),
	},
	{
		title: 'Social Event',
		icon: require('../assets/calendar_add.png'),
	},
	{
		title: 'Birthday',
		icon: require('../assets/calendar_add.png'),
	},
	{
		title: 'Social Reminder',
		icon: require('../assets/calendar_add.png'),
	},
];

export default class EventTypes extends Component {
	static event(index) {
		const event = all[index];
		return event;
	}
}