import React, { Component } from 'react';
import {
	View,
	Text,
	Image,
	StyleSheet,
	TouchableOpacity,
	TouchableHighlight,
	Modal,
	TextInput,
	Alert,
	FlatList,
	EventSubscriptionVendor,
	ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import DatePicker from 'react-native-datepicker';
import RNPickerSelect from 'react-native-picker-select';
import Swipeable from 'react-native-swipeable-row';
import AppBar from '../generic/AppBar';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import Theme from '../Theme';
import Moment from 'react-moment';
import moment from 'moment';
import EventTypes from '../../api/models/eventTypes'
import EventManager, { Event } from '../../api/models/eventManager';
import * as EventActions from '../../api/redux/actions/eventActions'

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
	},
	logo: {
		resizeMode: 'contain',
		height: 64,
		marginTop: 20,
	},
	description: {
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: 14,
		color: Theme.Blue,
		alignSelf: 'center',
		textAlign: 'center',
	},

	description2: {
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: 14,
		color: Theme.Blue,
		alignSelf: 'center',
		textAlign: 'center',
		marginTop: 10,
	},

	calendar: {
		marginTop: 20,
	},

	calendarAdd: {
		width: 50,
		height: 50,
		alignSelf: 'center',
	},

	selectedDate: {
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: 18,
		color: Theme.Blue,
		alignSelf: 'center',
		textAlign: 'center',
		marginTop: 10,
	},

	rateContainer: {
		position: "absolute",
		flexDirection: 'column',
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
		flexWrap: "wrap",
		height: 30,
		bottom: 20,
		right: 20,
		backgroundColor: 'black',
	},

	enjoy: {
		backgroundColor: Theme.White,
		color: Theme.Blue,
		borderWidth: 1,
		paddingLeft: 10,
		paddingRight: 10,
		paddingTop: 5,
		paddingBottom: 5,
		shadowOffset: { width: 2, height: 2 },
		shadowColor: 'black',
		shadowOpacity: 50
	},
});

const modalStyles = StyleSheet.create({
	title: {
		alignSelf: 'center',
		padding: 20,
		color: Theme.DarkBlue,
		fontSize: 25,
		fontWeight: '600',
	},
	container: {
		paddingLeft: 20,
		paddingRight: 20,
		paddingTop: 20,
		paddingBottom: 40,
	},
	close: {
		width: 50,
		height: 50,
	},
	description: {
		alignSelf: 'center',
		padding: 10,
		color: Theme.DarkBlue,
		fontSize: 10,
	},
	input: {
		marginBottom: 10,
		paddingLeft: 10,
		paddingRight: 10,
		paddingTop: 5,
		paddingBottom: 5,
		fontSize: 20,
		color: Theme.DarkBlue,
		backgroundColor: 'white',
	},
	buttonContainer: {
		flexDirection: 'column',
		flexWrap: 'wrap',
		justifyContent: 'center',
		alignContent: 'center',
	},
	buttonTitle: {
		alignSelf: 'center',
		backgroundColor: Theme.White,
		color: Theme.Blue,
		borderWidth: 1,
		paddingLeft: 10,
		paddingRight: 10,
		paddingTop: 5,
		paddingBottom: 5,
		shadowOffset: { width: 2, height: 2 },
		shadowColor: 'black',
		shadowOpacity: 50,
		textAlign: 'center',
	},
	selectContainer: {
		position: 'absolute',
		right: -10,
		top: 0,
		width: 50,
		height: 50,
		borderRadius: 25,
	},
	select: {
		position: 'relative',
		justifyContent: 'center',
		alignItems: 'center',
		width: 50,
		height: 50,
		backgroundColor: Theme.Blue,
		borderRadius: 25,
		borderWidth: 3,
		borderColor: Theme.White,
		shadowColor: Theme.Black,
		shadowOpacity: 0.16,
		shadowOffset: { width: 0, height: 3 },
		shadowRadius: 6,
	},
	selectImage: {
		resizeMode: 'contain',
		width: 36,
		height: 36,
	},
	eventTypeContainer: {
		flexDirection: 'row',
		backgroundColor: '#ffffff',
	},
	eventTypeIcon: {
		alignSelf: 'center',
		padding: 10,
		margin: 5,
		height: 25,
		width: 25,
		resizeMode: 'stretch',
	},
	eventTypeTitle: {
		flex: 1,
		textAlignVertical: 'center',
		fontSize: 20,
		color: Theme.DarkBlue,
		backgroundColor: 'white',
	}
});

const pickerSelectStyles = StyleSheet.create({
	inputIOS: {
		marginTop: 5,
		fontSize: 20,
		color: 'black',
	},
	inputAndroid: {
		fontSize: 16,
		paddingHorizontal: 10,
		paddingVertical: 8,
		color: 'black',
		paddingRight: 30, // to ensure the text is never behind the icon
	},
});

const eventListStyles = StyleSheet.create({
	list: {
		height: 300,
		marginTop: 20,
	},
	container: {
		flexDirection: "row",
		paddingLeft: 20,
		paddingRight: 20,
		paddingTop: 5,
		paddingBottom: 5,
	},
	title: {
		flex: 1,
		alignSelf: "flex-end",
		color: Theme.Blue,
		fontSize: 15,
		textAlign: "right",
	},
	color: {
		alignSelf: "center",
		width: 10,
		height: 10,
		borderRadius: 5,
	},
	icon: {
		marginLeft: 15,
		width: 20,
		height: 20,
	}
});

const isEqualDate = (date1, date2) => {
	return (date1.getFullYear() == date2.getFullYear())
		&& (date1.getMonth() == date2.getMonth())
		&& (date1.getDate() == date2.getDate())
}

class EventListItem extends Component {
	constructor(props) {
		super(props)

		this.state = {
			isSwiping: false,
		}
	}

	swipeable = null;
	handleUserBeganScrollingParentView() {
		this.swipeable.recenter();
	}

	SwipableRightContent =
		<View style={{ backgroundColor: "#fd9426", flex: 1, justifyContent: 'center', }}>
			<View style={{ marginLeft: '1%', marginRight: '65%' }}>
				<Text style={{ textAlign: 'center', fontWeight: 'bold', color: Theme.White }}>Delete</Text>
			</View>
		</View>

	onDeleteEvent(event) {
		this.props.onDeleteEvent(event)
	}

	render() {
		return (
			<Swipeable
				onRef={(ref) => { this.swipeable = ref }}
				onSwipeRelease={() => { this.swipeable.recenter() }}
				rightContent={this.SwipableRightContent}
				onRightActionRelease={() => { this.onDeleteEvent(this.props.event) }} >
				<View style={eventListStyles.container}>
					<View style={eventListStyles.color} backgroundColor={this.props.event.typeRef.color}></View>
					<Image style={eventListStyles.icon} source={this.props.event.typeRef.icon}></Image>
					<Text style={eventListStyles.title}>{this.props.event.comment}</Text>
				</View>
			</Swipeable>
		)
	}
}

class CalendarPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedDate: new Date(),
			isSwiping: false,
			showNewEventModal: false,
			showNewEventDatePicker: true,
			showNewEventTypePicker: true,
			newEventDate: new Date(),
			newEventLabel: '',
			newEventIndex: 0,
		}

		this.onNewEventDoneBtnClicked = this.onNewEventDoneBtnClicked.bind(this);
	}

	onEnjoyBtnPressed() {
		Alert.alert(
			'Welcome to My First App',
			'Hello World',
			[{ text: 'OK', },],
			{ cancelable: false },
		);
	}

	onCalendarDateSelected = (date) => {
		this.setState({ selectedDate: moment(date.dateString, 'YYYY-MM-DD').toDate() });
	}

	onNewEventDateSelected = (date) => {
		this.setState({ newEventDate: moment(date, 'MMMM Do YYYY').toDate() })
	}

	onNewEventDoneBtnClicked() {
		const newEvent = new Event({ index: this.state.newEventIndex, comment: this.state.newEventLabel, date: this.state.newEventDate })
		this.props.newEvent(newEvent)
		this.setState({
			showNewEventModal: false,
		});

		this.calendar.setState({});
	}

	onDeleteEvent(event) {
		this.props.deleteEvent(event)
		this.setState({})
		this.calendar.setState({})
	}

	renderDate = (date, state) => {
		let events = this.props.events ? this.props.events : []
		events = EventManager.eventWithDate(events, date)
		return (
			<View style={{ backgroundColor: Theme.Gray, flexWrap: "wrap" }}>
				<Text style={{ textAlign: 'center', color: Theme.Gray }}>
					{date.day}
				</Text>
				<View style={{ flexDirection: "row", height: 15 }}>
					{
						events.map((item, index) => {
							<View />
						})
					}
				</View>
			</View>
		);
	}

	renderMarkedDates() {
		const events = this.props.events ? this.props.events : []
		const dates = EventManager.allDates(events);
		const format = "YYYY-MM-DD";

		let result = {};
		for (var i = 0; i < dates.length; i++) {
			let events = this.props.events ? this.props.events : []
			events = EventManager.eventWithDate(events, dates[i]);
			const strDate = moment(dates[i]).format(format);
			const colors = events.map((event, index) => {
				console.log(event)
				return event.typeRef.color
			})

			result = {
				...result,
				[strDate]: {
					dots: colors.map((color, index) => { return { color: color, selectedColor: color }; }),
				}
			};
		}
		return result;
	}

	render() {
		const selectedEvent = EventTypes.event(this.state.newEventIndex);
		const eventTypePickerData = [];
		EventTypes.all.map((eventType, index) => {
			eventTypePickerData.push({ label: eventType.title, value: eventType.title });
		});
		const events = this.props.events ? this.props.events : []
		const currentEventList = EventManager.eventWithDate(events, this.state.selectedDate);
		return (
			<View style={styles.container}>
				<AppBar height={100}>
					<Image
						style={styles.logo}
						source={require('../../assets/logo.png')}
					/>
				</AppBar>
				<View style={{ flex: 1 }}>
					<ScrollView>
						<Text style={styles.description}>{"Add Birthdays/Events/Reminders to your\nSocial Calendar!"}</Text>
						<Text style={styles.description2}>{"You'll get a Ping on the day of the event."}</Text>
						<Calendar
							ref={(calendar) => { this.calendar = calendar; }}
							horizontal={true}
							pagingEnabled={true}
							style={{ marginTop: 20 }}
							onDayPress={this.onCalendarDateSelected}
							markedDates={
								// {
								// 	'2020-01-25': { dots: [vacation, massage, workout], disabled: false },
								// 	'2020-01-26': { dots: [vacation, massage], disabled: false },
								// }
								this.renderMarkedDates()
							}
							markingType={'multi-dot'} />
						<TouchableOpacity
							onPress={() => {
								this.setState({
									newEventDate: this.state.selectedDate,
									showNewEventModal: true
								})
							}}>
							<Image style={styles.calendarAdd} source={require('../../assets/calendar_add.png')}></Image>
						</TouchableOpacity>
						<Text style={styles.selectedDate}>
							{'Events on '}
							<Moment element={Text} format='MMMM Do, YYYY'>{this.state.selectedDate}</Moment>
						</Text>
						<FlatList
							scrollEnabled={!this.state.isSwiping}
							style={[eventListStyles.list]}
							data={currentEventList}
							renderItem={({ item }) => {
								return <EventListItem event={item} onDeleteEvent={() => { this.onDeleteEvent(item) }} />
							}}
						/>
					</ScrollView>
					<View style={styles.rateContainer}>
						<TouchableOpacity style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-end' }}
							onPress={this.onEnjoyBtnPressed}>
							<Text style={styles.enjoy}>Enjoy PingD?</Text>
						</TouchableOpacity>
					</View>
				</View>
				<Modal transparent animationType='fade' visible={this.state.showNewEventModal} style={{ backgroundColor: 'blue' }}>
					<View
						style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', }}>
						<Text style={{ alignSelf: 'center', fontSize: 25, backgroundColor: 'white' }}>
							<Moment element={Text} format='MMMM YYYY'>{this.state.selectedDate}</Moment>
						</Text>
						<View style={{ flexWrap: 'wrap', alignSelf: 'center', borderRadius: 10, backgroundColor: Theme.FadedBlueContact, }}>
							<TouchableOpacity onPress={() => { this.setState({ showNewEventModal: false }) }}>
								<Image source={require('../../assets/close.png')} style={modalStyles.close} />
							</TouchableOpacity>
							<View style={modalStyles.container}>
								<Text style={modalStyles.title}>Event Name:</Text>
								<TextInput style={modalStyles.input}
									placeholder='event name here'
									placeholderTextColor={Theme.DarkGray}
									text={this.state.newEventLabel}
									onChangeText={(text) => { this.setState({ newEventLabel: text }) }} />
								<Text style={modalStyles.title}>Type:</Text>
								<View style={modalStyles.eventTypeContainer}>
									<Image style={modalStyles.eventTypeIcon}
										source={selectedEvent ? selectedEvent.icon : null} />
									<RNPickerSelect
										items={eventTypePickerData}
										onValueChange={value => {
											EventTypes.all.map((item, index) => {
												if (item.title == value) {
													this.setState({ newEventIndex: index });
												}
											});
										}}
										style={{
											...pickerSelectStyles,
										}}
										value={selectedEvent ? selectedEvent.title : ""}
										useNativeAndroidPickerStyle={false}
										textInputProps={{ underlineColor: 'yellow' }}
									/>
								</View>
								<Text style={modalStyles.description}>
									* Birthday events will be saved to repeat every year:
								</Text>
								<Text style={modalStyles.title}>Date:</Text>
								<View style={{ flexDirection: "row", alignContent: "stretch" }}>
									<DatePicker
										ref={(picker) => { this.datePicker = picker; }}
										style={{ flex: 1 }}
										date={this.state.newEventDate}
										mode="date"
										format="MMMM Do YYYY"
										confirmBtnText="Confirm"
										cancelBtnText="Cancel"
										showIcon={false}
										fontSize={30}
										customStyles={{
											dateInput: {
												color: Theme.DarkBlue,
												backgroundColor: 'white',
											}
											// ... You can check the source to find the other keys.
										}}
										onDateChange={this.onNewEventDateSelected} />
								</View>
								<View style={{ marginTop: 10 }}>
									<TouchableOpacity style={modalStyles.buttonContainer}
										onPress={() => { this.datePicker.onPressDate(); }}>
										<Text style={modalStyles.buttonTitle}>Change Date</Text>
									</TouchableOpacity>
									<TouchableOpacity style={modalStyles.selectContainer}
										onPress={this.onNewEventDoneBtnClicked}>
										<View style={modalStyles.select}>
											<Image style={modalStyles.selectImage} source={require('../../assets/check.png')} />
										</View>
									</TouchableOpacity>
								</View>
							</View>
						</View>
					</View>
				</Modal>
			</View >
		);
	}
}

const mapStateToProps = (state) => {
	return {
		events: state.events.events,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		newEvent: (event) => dispatch(EventActions.newEvent(event)),
		deleteEvent: (event) => dispatch(EventActions.deleteEvent(event))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(CalendarPage);