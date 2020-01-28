import React from 'react-native';
import { Platform } from 'react-native';

export default class PlatformManager {
	static isIOS = () => {
		return Platform.OS == "ios";
	}

	static isAndroid = () => {
		return Platform.OS == "android";
	}
}