/*
 * detectFirstLaunch.js
 * check if this is the 1st time launching the app
 */

import { AsyncStorage } from "@react-native-community/async-storage";


const HAS_LAUNCHED = "hasLaunched";


function setLaunched() {
    AsyncStorage.setItem(HAS_LAUNCHED, "true");
}


export default async function detectFirstLaunch() {
    try {
        const hasLaunched = await AsyncStorage.getItem(HAS_LAUNCHED);
        if (hasLaunched === null) {
            setLaunched();
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
}
