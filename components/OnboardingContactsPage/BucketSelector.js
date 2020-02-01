import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import PropTypes from 'prop-types';

import Theme from '../Theme';
import { Types } from '../ContactUtils';
import { ContactPriority, Contact } from "../../api/models/contactManager"


const Selector = (props) => {
    let text = '';
    let bgColor = '';

    if (props.friend) {
        bgColor = props.selected ? ContactPriority.Friend.color : ContactPriority.Friend.fadeColor;
        text = ContactPriority.Friend.text;
    } else if (props.acquaintance) {
        bgColor = props.selected ? ContactPriority.Acquaintance.color : ContactPriority.Acquaintance.fadeColor;
        text = ContactPriority.Acquaintance.text;
    } else if (props.touchpoint) {
        bgColor = props.selected ? ContactPriority.TouchPoint.color : ContactPriority.TouchPoint.fadeColor;
        text = ContactPriority.TouchPoint.text;
    }

    return (
        <TouchableOpacity style={{ flex: 1 }} onPress={props.setPriority}>
            <View style={[styles.selector, { backgroundColor: bgColor }]}>
                <Text style={styles.selectorText}>{text}</Text>
            </View>
        </TouchableOpacity>
    );
};

Selector.propTypes = {
    selected: PropTypes.bool.isRequired,
    friend: PropTypes.bool,
    acquaintance: PropTypes.bool,
    touchpoint: PropTypes.bool,
    setPriority: PropTypes.func.isRequired,
};


class BucketSelector extends Component {
    constructor(props) {
        super(props);
        this.select = this.select.bind(this);
    }

    select(priority) {
        this.setState({ selected: priority });
        this.props.setPriority(priority);
        this.props.expand();
    }

    render() {
        let priority = this.props.priority;
        return (
            <View style={styles.container}>
                <Selector friend
                    selected={priority === ContactPriority.Friend.rawValue || priority == ContactPriority.Remove.rawValue}
                    setPriority={() => this.select(ContactPriority.Friend.rawValue)}
                />
                <Selector acquaintance
                    selected={priority === ContactPriority.Acquaintance.rawValue || priority == ContactPriority.Remove.rawValue}
                    setPriority={() => this.select(ContactPriority.Acquaintance.rawValue)}
                />
                <Selector touchpoint
                    selected={priority === ContactPriority.TouchPoint.rawValue || priority == ContactPriority.Remove.rawValue}
                    setPriority={() => this.select(ContactPriority.TouchPoint.rawValue)}
                />
            </View>
        );
    }
}

BucketSelector.propTypes = {
    priority: PropTypes.number.isRequired,
    expand: PropTypes.func.isRequired,
    setPriority: PropTypes.func.isRequired,
    style: PropTypes.array,
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    selector: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    selectorText: {
        fontSize: 12,
        color: Theme.White,
        margin: 10,
    },
});

export default BucketSelector;