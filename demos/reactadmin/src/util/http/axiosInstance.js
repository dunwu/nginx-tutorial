import axios from 'axios';
import axiosConfig from './axiosConfig';

// 本项目的默认配置
// 使用默认配置初始化的请求
const http = axios.create(axiosConfig);
export default http;
