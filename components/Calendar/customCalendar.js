import React, { Component } from 'react'
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';
import Theme from '../Theme';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';

const styles = StyleSheet.create({
	calendar: {
		marginTop: 20,
	},

	dateStyle: {

	},

	selectedDateStyle: {

	}
});

export default class CustomCalendar extends Component {
	constructor() {
		super();
	}

	render() {
		return (
			<CalendarList
				horizontal={true}
				pagingEnabled={true}
			/>
		);
	}
}
