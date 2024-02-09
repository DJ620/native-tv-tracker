import AsyncStorage from '@react-native-async-storage/async-storage';
import {decode as atob, encode as btoa} from 'base-64';

export default {
    getToken: async function() {
        let token = await AsyncStorage.getItem("token");
        if (token) {
            return token;
        } else {
            return null;
        }
    },

    getId: async function() {
        const token = await this.getToken();
        return token ? JSON.parse(atob(token.split(".")[1])).userId : null;
    },

    getUsername: async function() {
        const token = await this.getToken();
        return token ? JSON.parse(atob(token.split(".")[1])).username : null;
    }
};