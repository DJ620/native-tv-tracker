import axios from 'axios';

export default {
    getShowInfo: async (showId) => {
        return axios.get(`https://api.tvmaze.com/shows/${showId}?embed[]=episodes&embed[]=cast&embed[]=images`);
    },

    getGuestCast: async (episodeId) => {
        return axios.get(`https://api.tvmaze.com/episodes/${episodeId}/guestcast`);
    },

    getActorCredits: (actorId) => {
        return axios.get(`https://api.tvmaze.com/people/${actorId}/castcredits?embed[]=show&embed[]=character`);
    },

    getActorGuestCredits: (actorId) => {
        return axios.get(`https://api.tvmaze.com/people/${actorId}/guestcastcredits?embed[]=episode&embed[]=character`);
    },

    getGuestCreditShow: (url) => {
        return axios.get(url);
    },

    searchShow: (searchShow) => {
        return axios.get(`https://api.tvmaze.com/search/shows?q=${searchShow}`);
    },

    searchActor: (searchActor) => {
        return axios.get(`https://api.tvmaze.com/search/people?q=${searchActor}`);
    }
}