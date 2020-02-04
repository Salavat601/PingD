/*
 * detectFirstLaunch.js
 * check if this is the 1st time launching the app
 */

import AsyncStorage from '@react-native-community/async-storage';


const HAS_LAUNCHED = "hasLaunched";


export function setLaunched() {
	try {
		AsyncStorage.setItem(HAS_LAUNCHED, "true");
	} catch (error) {
		console.log(error)
	}
}

export default async function detectFirstLaunch() {
	try {
		const hasLaunched = await AsyncStorage.getItem(HAS_LAUNCHED);
		console.log('hasLaunched', hasLaunched)
		if (hasLaunched !== null) {
			return false;
		} else {
			setLaunched();
			return true;
		}
	} catch (error) {
		console.log(error)
		return false;
	}
}
