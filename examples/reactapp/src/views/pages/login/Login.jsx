import { Button, Card, Col, Form, Icon, Input, message, Row } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'

import { login } from '../../../redux/actions/auth'
import loginLogo from './login-logo.png'

import './Login.less'

const FormItem = Form.Item

const propTypes = {
  user: PropTypes.object,
  loggingIn: PropTypes.bool,
  message: PropTypes.string
}

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

class Login extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false
    }
  }

  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields()
  }

  handleSubmit(e) {
    e.preventDefault()

    this.setState({
      loading: true
    })

    const data = this.props.form.getFieldsValue()
    this.props.login(data.user, data.password).payload.promise.then(response => {
      this.setState({
        loading: false
      })

      if (response.error) {
        console.warn('login failed: ', response.payload.message)
      } else {
        let result = response.payload.data
        console.log('login result:', result)
        if (result) {
          if (0 !== result.code) {
            let str = ''
            if (Array.isArray(result.messages)) {
              result.messages.map((item) => {
                str = str + item + '\n'
              })
            }
            message.error('登录失败: \n' + str)
          } else {
            console.info('[Login] res.payload.data: ', result)
            message.success('欢迎你，' + result.data.name)
            this.props.history.replace('/')
          }

        }
      }
    }).catch(err => {
      console.error('[Login] err: ', err)
      this.setState({
        loading: false
      })
    })
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.info('提交表单信息', values)
      } else {
        console.error(err)
      }
    })
  }

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched, setFieldsValue } = this.props.form
    // Only show error after a field is touched.
    const userNameError = isFieldTouched('userName') && getFieldError('userName')
    const passwordError = isFieldTouched('password') && getFieldError('password')

    return (
      <Row className="login-row" type="flex" justify="space-around" align="middle">
        <Card className="login-form">
          <Row gutter={12} type="flex" justify="space-around" align="middle">
            <Col span="{6}">
            </Col>
            <Col span="{6}">
              <img alt="loginLogo" src={loginLogo} style={{ width: 50, height: 50 }}/>
            </Col>
            <Col span="{6}">
              <h1>React 管理系统</h1>
            </Col>
            <Col span="{6}">
            </Col>
          </Row>
          <Form layout="horizontal" onSubmit={this.handleSubmit.bind(this)}>
            <FormItem validateStatus={userNameError ? 'error' : ''}
                      help={userNameError || ''}>
              {getFieldDecorator('user', {
                rules: [{ required: true, message: 'Please input your username!' }]
              })(
                <Input
                  className="input"
                  prefix={<Icon type="user" style={{ fontSize: 18 }}/>}
                  ref={node => this.userNameInput = node}
                  placeholder="admin"
                />
              )}
            </FormItem>
            <FormItem validateStatus={passwordError ? 'error' : ''}
                      help={passwordError || ''}>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Please input your password!' }]
              })(
                <Input className="input" size="large"
                       prefix={<Icon type="lock" style={{ fontSize: 18 }}/>}
                       type='password'
                       placeholder='123456'/>
              )}
            </FormItem>
            <p>
              <Button className="btn-login" type='primary' size="large" icon="poweroff"
                      loading={this.state.loading}
                      htmlType='submit'
                      disabled={hasErrors(getFieldsError())}>确定</Button>
            </p>
          </Form>
        </Card>
      </Row>
    )
  }
}

Login.propTypes = propTypes

Login = Form.create()(Login)

function mapStateToProps(state) {
  const { auth } = state
  if (auth.user) {
    return { user: auth.user, loggingIn: auth.loggingIn, message: '' }
  }

  return { user: null, loggingIn: auth.loggingIn, message: auth.message }
}

function mapDispatchToProps(dispatch) {
  return {
    login: bindActionCreators(login, dispatch)
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login))
