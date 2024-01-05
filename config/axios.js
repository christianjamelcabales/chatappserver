
import axios from 'axios';
const myPath = import.meta.env.SERVER_URL;
export const myAxios = axios.create({
    withCredentials: false,
    baseURL: myPath
})
