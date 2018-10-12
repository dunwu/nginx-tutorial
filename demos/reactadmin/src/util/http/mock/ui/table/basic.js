/**
 * `/example/table/basic/list` 的 Mock 数据
 * @see https://github.com/nuysoft/Mock/wiki
 * @see http://mockjs.com/examples.html
 */
const Mock = require('mockjs');

const Random = Mock.Random;

const data = [];
for (let i = 0; i < 46; i += 1) {
  const loginName = Random.name();
  data.push({
    id: i,
    avatar: Random.image('64x64', Random.color(), '#ffffff', loginName[0]),
    loginName,
    password: Random.name(),
    name: Random.cname(),
    idCard: Random.id(),
    birthday: Random.date('yyyy-MM-dd'),
    email: Random.email(),
    tel: `0${Random.string('number', 2, 3)}-${Random.string('number', 7, 7)}`,
    mobile: Random.string('number', 11, 11),
    address: Random.county(true),
    zip: Random.zip(),
    statu: Random.integer(0, 1),
    createTime: Random.datetime('yyyy-MM-dd HH:mm:ss'),
    updateTime: Random.datetime('yyyy-MM-dd HH:mm:ss'),
    description: Random.cparagraph(3, 10)
  });
}

module.exports = {
  code: 0,
  message: '成功',
  data
};
