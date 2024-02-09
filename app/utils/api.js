const baseUrl = "https://tv-tracker-4s31.onrender.com";
import axios from "axios";

export default {
    createUser: async (userData) => {
        return axios.post(`${baseUrl}/api/user/register`, userData);
    },

    login: (userData) => {
        return axios.post(`${baseUrl}/api/user/login`, userData);
    },

    verify: (token) => {
        return axios.get(`${baseUrl}/api/user/${token}`);
    },

    getShowLibrary: (userId) => {
        return axios.get(`${baseUrl}/api/show/${userId}`);
    },

    addShow: (showData) => {
        return axios.post(`${baseUrl}/api/show/add`, showData);
    },

    deleteShow: (showId, episodeIds, userId) => {
        return axios.post(`${baseUrl}/api/show/delete`, {showId, episodeIds, userId});
    },

    watchSeason: (seasonData) => {
        return axios.post(`${baseUrl}/api/episode/watchSeason`, seasonData);
    },

    unwatchSeason: (seasonData) => {
        return axios.post(`${baseUrl}/api/episode/unwatchSeason`, seasonData);
    },

    watchEpisode: (episodeData) => {
        return axios.post(`${baseUrl}/api/episode/watch`, episodeData);
    },

    unwatchEpisode: (episodeData) => {
        return axios.post(`${baseUrl}/api/episode/unwatch`, episodeData);
    },
}