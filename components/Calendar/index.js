import React, { Component } from 'react';
import {
	View,
	Text,
	Image,
	StyleSheet,
	TouchableOpacity,
	Modal,
	TextInput,
	Alert,
} from 'react-native';
import DatePicker from 'react-native-datepicker'
import AppBar from '../generic/AppBar';
import CustomCalendar from './customCalendar';
import Theme from '../Theme';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Moment from 'react-moment';
import moment from 'moment';
import EventTypes from '../../api/eventTypes';

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
		marginTop: -40,
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
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
		marginBottom: 20,
		marginRight: 20,
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
		alignItems: 'center',
		backgroundColor: '#ffffff',
	},
	eventTypeIcon: {
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


const isEqualDate = (date1, date2) => {
	return (date1.getFullYear() == date2.getFullYear())
		&& (date1.getMonth() == date2.getMonth())
		&& (date1.getDate() == date2.getDate())
}

export default class CalendarPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedDate: new Date(),
			showAddEvent: false,
			showModalDatePicker: false,
			selectedEventIndex: 0,
		}

		this.onAddEventDoneBtnClicked = this.onAddEventDoneBtnClicked.bind(this);
	}

	onEnjoyBtnPressed() {
		Alert.alert(
			'Welcome to My First App',
			'Hello World',
			[{ text: 'OK', },],
			{ cancelable: false },
		);
	}

	onAddEventDoneBtnClicked() {
		this.setState({
			showAddEvent: false
		});
	}



	render() {
		const selectedEvent = EventTypes.event(this.state.selectedEventIndex);
		return (
			<View style={styles.container}>
				<AppBar height={100}>
					<Image
						style={styles.logo}
						source={require('../../assets/logo.png')}
					/>
				</AppBar>
				<View>
					<Text style={styles.description}>{"Add Birthdays/Events/Reminders to your\nSocial Calendar!"}</Text>
					<Text style={styles.description2}>{"You'll get a Ping on the day of the event."}</Text>
					<CustomCalendar style={{ marginTop: 20 }} />
					<TouchableOpacity
						onPress={() => {
							this.setState({
								showAddEvent: true
							})
						}}>
						<Image style={styles.calendarAdd} source={require('../../assets/calendar_add.png')}></Image>
					</TouchableOpacity>
					<Text style={styles.selectedDate}>{'Events on January 10th, 2019'}</Text>
				</View>
				<View style={styles.rateContainer}>
					<TouchableOpacity style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-end' }}
						onPress={this.onEnjoyBtnPressed}>
						<Text style={styles.enjoy}>Enjoy PingD?</Text>
					</TouchableOpacity>
				</View>
				<Modal presentationStyle='overFullScreen' visible={this.state.showAddEvent} style={{ backgroundColor: 'blue' }}>
					<View
						style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', }}>
						<Text style={{ alignSelf: 'center', fontSize: 25 }}><Moment element={Text} format='MMMM YYYY'>{this.state.selectedDate}</Moment></Text>
						<View style={{ flexWrap: 'wrap', alignSelf: 'center', borderRadius: 10, backgroundColor: Theme.FadedBlueContact, }}>
							<TouchableOpacity onPress={() => { this.setState({ showAddEvent: false }) }}>
								<Image source={require('../../assets/close.png')} style={modalStyles.close} />
							</TouchableOpacity>
							<View style={modalStyles.container}>
								<Text style={modalStyles.title}>Event Name:</Text>
								<TextInput style={modalStyles.input} placeholder='event name here' placeholderTextColor={Theme.DarkGray} />
								<Text style={modalStyles.title}>Type:</Text>
								<TouchableOpacity activeOpacity={0.5} style={modalStyles.eventTypeContainer}>
									<Image style={modalStyles.eventTypeIcon}
										source={selectedEvent.icon} />
									<Text style={modalStyles.eventTypeTitle}>{selectedEvent.title}</Text>
								</TouchableOpacity>
								<Text style={modalStyles.description}>
									* Birthday events will be saved to repeat every year:
								</Text>
								<Text style={modalStyles.title}>Date:</Text>
								<View style={{ flexDirection: "row", alignContent: "stretch" }}>
									<DatePicker
										ref={(picker) => { this.datePicker = picker; }}
										style={{ flex: 1 }}
										date={this.state.selectedDate}
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
										onDateChange={(date) => {
											console.log(date);
											this.setState({ selectedDate: moment(date, 'MMMM Do YYYY').toDate() })
										}} />
								</View>
								<View style={{ marginTop: 10 }}>
									<TouchableOpacity style={modalStyles.buttonContainer}
										onPress={() => { this.datePicker.onPressDate(); }}>
										<Text style={modalStyles.buttonTitle}>Change Date</Text>
									</TouchableOpacity>
									<TouchableOpacity style={modalStyles.selectContainer}
										onPress={this.onAddEventDoneBtnClicked}>
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