import axios from 'axios';

export default {
    getShowInfo: async (showId) => {
        return axios.get(`https://api.tvmaze.com/shows/${showId}?embed[]=episodes&embed[]=cast&embed[]=images`);
    },

    getGuestCast: async (episodeId) => {
        return axios.get(`https://api.tvmaze.com/episodes/${episodeId}/guestcast`);
    }
}