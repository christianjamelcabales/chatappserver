
import axios from 'axios';
const myPath = import.meta.env.VITE_path_main;
export const myAxios = axios.create({
    withCredentials: false,
    baseURL: myPath
})
