import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, InteractionManager } from 'react-native';
import PropTypes from 'prop-types';
import EventManager from '../../api/event/eventManager';

const weekDaysNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

class CalendarDayComponent extends React.Component {
	constructor(props) {
		super(props);
		this.onDayPress = this.onDayPress.bind(this);

		this.state = {

		}
	}

	getContentStyle() {
		const { state, marking = {}, date, current } = this.props;
		const style = {
			content: {},
			text: {
				color: '#181c26'
			}
		};

		if (marking.soldOut) {
			style.text.color = '#fff';
			style.content.backgroundColor = '#e35052';
			style.content.borderRadius = 50;
		} else if (marking.blocked) {
			style.text.color = '#fff';
			style.content.backgroundColor = '#c1c2c1';
			style.content.borderRadius = 50;
		} else if (state === 'disabled') {
			style.text.color = '#c1c2c1';
		} else if (state === 'today') {
			style.text.color = '#fff';
			style.content.backgroundColor = '#216bc9';
			style.content.borderRadius = 50;
		} else if (current === date.dateString) {
			style.content.borderRadius = 50;
			style.content.borderWidth = 1;
			style.content.borderColor = '#216bc9';
		}

		return style;
	}

	getFooterTextStyle() {
		const { marking = {} } = this.props;
		const style = {
			color: '#c1c2c1'
		};

		if (marking.inventory > 0) {
			style.color = '#4caf50';
		}
		return style;
	}

	getInventoryCount() {
		const { marking = {} } = this.props;
		if (typeof marking === 'object') {
			if (marking.inventory >= 0) {
				return marking.inventory;
			}
		}
		return 'NA';
	}

	onDayPress() {
		this.props.onPress(this.props.date);
	}

	renderDots() {
		const events = EventManager.sharedInstance.eventWithDate(this.props.date);
		return events.map((item, index) => {
			return (
				<View style={[dotStyles.content, { backgroundColor: item.ref.color }]} />
			)
		})
	}

	render() {
		const contentStyle = this.getContentStyle();

		return (
			<View style={styles.container}>
				<View style={styles.header}>
					{
						this.props.horizontal ?
							<Text style={styles.weekName} numberOfLines={1}>
								{
									weekDaysNames[this.props.date.weekDay]
								}
							</Text>
							:
							null
					}
				</View>
				<TouchableOpacity style={[styles.content, contentStyle.content]}
					onPress={this.onDayPress}>
					<Text style={[styles.contentText, contentStyle.text]}>
						{String(this.props.children)}
					</Text>
				</TouchableOpacity>
				<View style={dotStyles.container}>
					{this.renderDots()}
				</View>
			</View>
		);
	}
}

CalendarDayComponent.propTypes = {
	children: PropTypes.any,
	state: PropTypes.string,
	marking: PropTypes.any,
	horizontal: PropTypes.bool,
	date: PropTypes.object,
	onPress: PropTypes.func.isRequired,
	current: PropTypes.string
};

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: "stretch",
	},
	weekName: {
		width: 32,
		textAlign: 'center',
		fontSize: 12,
		textTransform: 'uppercase',
		fontWeight: 'bold',
		color: '#7c7c7c'
	},
	content: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	contentText: {
		alignSelf: "flex-start",
		fontSize: 10,
	}
});

const dotStyles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 10,
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 1,
	},
	content: {
		width: 10,
		height: 10,
		borderRadius: 5,
	},
});

export default CalendarDayComponent;