import {
  Alert,
  Button,
  Card,
  Cascader,
  DatePicker,
  Form,
  Icon,
  Input,
  message,
  Radio,
  Select,
  Slider,
  Tooltip,
  Upload
} from 'antd';
import React from 'react';
import area from '../../util/area.json';
import './BasicForm.less';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class BasicForm extends React.Component {
  state = {
    currentRecord: {}
  };

  onChange = (key, value) => {
    console.log('onChange', key, value);
    const temp = this.state.currentRecord;
    temp[key] = value;
    this.setState({
      currentRecord: temp
    });
  };

  onChangeArea = (value, selectedOptions) => {
    console.log('选择的省市区数据', value, selectedOptions);
  };

  normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        message.error('提交失败，请完善表单信息');
      } else {
        message.info('提交成功');
        console.log('提交的表单数据', values);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '86'
    })(
      <Select style={{ width: 60 }}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    );
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 }
      }
    };
    return (
      <Card noHovering bordered={false}>
        <Alert
          showIcon
          closable
          message="提示"
          type="info"
          description="具有数据收集、校验和提交功能的表单，包含复选框、单选框、输入框、下拉选择框等元素。"
        />
        <br />
        <FormItem
          {...formItemLayout}
          label="头像"
          extra="只能上传图片"
        >
          {getFieldDecorator('avatar', {
            valuePropName: 'fileList',
            getValueFromEvent: this.normFile
          })(
            <Upload name="avatar" action="/upload.do" listType="picture">
              <Button>
                <Icon type="upload" /> 点击上传
              </Button>
            </Upload>
          )}
        </FormItem>
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label="昵称"
            hasFeedback
          >
            {getFieldDecorator('nickname', {
              rules: [
                { required: true, message: '请输入昵称！' }
              ]
            })(
              <Input
                prefix={<Icon type="user" style={{ fontSize: 14 }} />}
                onChange={e => this.onChange('nickname', e.target.value)}
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="邮箱"
            hasFeedback
          >
            {getFieldDecorator('email', {
              rules: [
                { required: true, message: '请输入邮箱！' },
                { type: 'email', message: '输入内容不是有效的邮箱！' }
              ]
            })(
              <Input onChange={e => this.onChange('email', e.target.value)} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="手机号"
          >
            {getFieldDecorator('mobile', {
              rules: [{ required: true, message: '请输入手机号！' }]
            })(
              <Input
                addonBefore={prefixSelector}
                style={{ width: '100%' }}
                onChange={e => this.onChange('mobile', e.target.value)}
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="性别"
          >
            {getFieldDecorator('sex', {
              rules: [
                { required: true, message: '请选择性别' }
              ]
            })(
              <RadioGroup onChange={e => this.onChange('sex', e.target.value)}>
                <Radio value="1">男</Radio>
                <Radio value="2">女</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="出生日期"
          >
            {getFieldDecorator('birthday', {
              rules: [
                { required: true, message: '请选择出生日期！' }
              ]
            })(
              <DatePicker showTime format="YYYY-MM-DD" onOk={value => this.onChange('birthday', value)} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="省市区"
          >
            {getFieldDecorator('area', {
              rules: [
                { required: true, message: '请选择省市区！' }
              ]
            })(
              <Cascader options={area} onChange={this.onChangeArea} placeholder="请选择省市区" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="兴趣"
          >
            {getFieldDecorator('hobby', {})(
              <Select mode="multiple" placeholder="请选择你的兴趣">
                <Option value="0">科技</Option>
                <Option value="1">文化</Option>
                <Option value="2">时政</Option>
                <Option value="3">军事</Option>
                <Option value="4">娱乐</Option>
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="证件照片"
          >
            <div className="dropbox">
              {getFieldDecorator('dragger', {
                valuePropName: 'fileList',
                getValueFromEvent: this.normFile
              })(
                <Upload.Dragger name="files" action="/upload.do">
                  <p className="ant-upload-drag-icon">
                    <Icon type="inbox" />
                  </p>
                  <p className="ant-upload-text">点击或拖拽到指定区域来上传文件</p>
                </Upload.Dragger>
              )}
            </div>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={
              <span>
                权重
                <Tooltip title="权重">
                  <Icon type="question" style={{ marginRight: 4 }} />
                </Tooltip>
              </span>
            }
          >
            {getFieldDecorator('power')(
              <Slider marks={{ 0: 'A', 20: 'B', 40: 'C', 60: 'D', 80: 'E', 100: 'F' }} />
            )}
          </FormItem>
          <FormItem
            wrapperCol={{ span: 12, offset: 6 }}
          >
            <Button type="primary" htmlType="submit">提交</Button>
          </FormItem>
        </Form>
      </Card>
    );
  }
}
const WrappedBasicForm = Form.create()(BasicForm);
export default WrappedBasicForm;
