import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mockAxios = axios.create();

// mock 数据
const mockAdapter = new MockAdapter(mockAxios);
mockAdapter.onGet('/menu/list').reply(200, require('./menu'));
mockAdapter.onGet('/ui/table/basic/list').reply(200, require('./ui/table/basic'));
mockAdapter.onPost('/api/form/save').reply(200, require('./form'));

export default mockAxios;
