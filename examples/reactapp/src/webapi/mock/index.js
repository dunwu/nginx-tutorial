const axios = require('axios')
const MockAdapter = require('axios-mock-adapter')
const mockAxios = axios.create()

// mock 数据
const mock = new MockAdapter(mockAxios)
mock.onPut('/login').reply(config => {
  let postData = JSON.parse(config.data)
  console.info('[mock]', postData)
  if (postData.username === 'admin' && postData.password === '123456') {
    let result = require('./user')
    console.info('[mock result]', result)
    return [200, result]
  } else {
    return [500, { message: 'Incorrect user or password' }]
  }
})
mock.onGet('/logout').reply(200, {})
mock.onGet('/my').reply(200, require('./user'))
mock.onGet('/menu').reply(200, require('./menu'))

export default mockAxios
