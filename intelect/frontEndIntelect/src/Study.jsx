import axios from 'axios';

const Study = async (url) => {
  try {
    const response = await axios.get(url);
    console.log('Response data:', response.data);
  } catch (error) {
    console.error('Error occurred:', error);
  }
};

export default Study;