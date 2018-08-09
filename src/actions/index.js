import axios from 'axios';
import reqURL from '../components/RequestURL';

export const GET_ALL_VIDEOS = 'GET_ALL_VIDEOS';
export const ADD_VIDEO = 'ADD_VIDEO';

export const recieveVideoData = videoData => ({
  type: GET_ALL_VIDEOS,
  videoData,
});

export const getAllVideos = (index) => {
  const allVideosEndPoint = `${reqURL}/getAllVideos`;
  return (dispatch) => {
    return axios.post(allVideosEndPoint, index)
      .then((videoData) => {
        dispatch(recieveVideoData(videoData.data));
      })
      .catch((err) => {
        throw err;
      });
  };
};
