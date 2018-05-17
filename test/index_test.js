/* eslint-disable */
import 'babel-polyfill'
/* setup.js https://github.com/airbnb/enzyme/blob/master/docs/guides/jsdom.md */
const { JSDOM } = require('jsdom')

const jsdom = new JSDOM('<!doctype html><html><body></body></html>')
const { window } = jsdom

function copyProps(src, target) {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .reduce((result, prop) => ({
      ...result,
      [prop]: Object.getOwnPropertyDescriptor(src, prop),
    }), {})
  Object.defineProperties(target, props)
}

global.window = window
global.document = window.document
global.navigator = {
  userAgent: 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Mobile Safari/537.36',
}
copyProps(window, global)

import {expect} from 'chai'
const JSBridge = require('../lib').JSBridge
//
// describe('done', function (){
//   it('done test', function (done){
//     setTimeout(function (){
//       done()
//     }, 1900)
//   })
//   it('done test1', function (){
//     console.log('it里的输出')
//   })
//   console.log('it外的输出')
// })

/* eslint-disable no-console */
describe('连通性测试', () => {

    let jsBridge = null
    before(function () {
      // 模拟客户端注入的YnrccJSBridge 仅做连通性测试
      window.JSON = {
        parse() {
          return {
            ReturnCode: '000000'
          }
        },
        stringify() {}
      }
      JSBridge.config({
        global: {
          YnrccJSBridge: {
            event: function () {
              return null
            }
          }
        },
        debug: true,
        appId: '123456',
        timestamp: '98765412352',
        nonceStr: '666666',
        signature: '234b913e4b9780adebff19a82e65eb6800809c16',
        url: 'https://www.baidu.com?params=value',
        errorHandler(err){
          console.log(JSON.stringify(err))
        }
      }).then((bridge) => {
        jsBridge = bridge
        console.log('关闭窗口')
        jsBridge.closeWindow = () => {
          console.log('关闭窗口')
        }
        resolve()
      }).catch(err => {
        console.log(JSON.stringify(err))
        done()
      })
    })
  it('测试正常情况', (done) => {
    console.log(jsBridge)
    jsBridge.closeWindow().then((res)=>{
      console.log('1111', res);
      expect(res['ReturnCode']).to.be.equal('000000')
      done()
    })
  })
})
describe('连通性测试', () => {

    let jsBridge = null
    before(function () {
      // 模拟客户端注入的YnrccJSBridge 仅做连通性测试
      window.JSON = {
        parse() {
          return {
            ReturnCode: 'time_out',
            ReturnMsg: '请求超时'
          }
        },
        stringify() {}
      }
      JSBridge.config({
        global: {
          YnrccJSBridge: {
            event: function () {
              return null
            }
          }
        },
        debug: true,
        appId: '123456',
        timestamp: '98765412352',
        nonceStr: '666666',
        signature: '234b913e4b9780adebff19a82e65eb6800809c16',
        url: 'https://www.baidu.com?params=value',
        errorHandler(err){
          console.log(JSON.stringify(err))
        }
      }).then((bridge) => {
        jsBridge = bridge
        console.log(1)
        it('测试业务返回非000000情况', (done) => {
          jsBridge.closeWindow().catch((err)=>{
            expect(err['ReturnCode']).to.be.equal('time_out')
            done();
          })
        })
      }).catch(err => {
        console.log(JSON.stringify(err))
      })
    })
})


describe('连通性测试', () => {

    let jsBridge = null
    before(function () {
      // 模拟客户端注入的YnrccJSBridge 仅做连通性测试
      window.JSON = {
        parse() {
          throw new SyntaxError('Unexpected token u in JSON at position 0')
        },
        stringify() {}
      }
      JSBridge.config({
        global: {
          YnrccJSBridge: {
            event: function () {
              return null
            }
          }
        },
        debug: true,
        appId: '123456',
        timestamp: '98765412352',
        nonceStr: '666666',
        signature: '234b913e4b9780adebff19a82e65eb6800809c16',
        url: 'https://www.baidu.com?params=value',
        errorHandler(err){
          console.log(JSON.stringify(err))
        }
      }).then((bridge) => {
        jsBridge = bridge
        it('模拟客户端返回json字符串格式有误的情况', () => {
          jsBridge.closeWindow().catch((err)=>{
            // expect(err).to.throw(SyntaxError)
            expect(err['ReturnCode']).to.be.equal('parse_client_res_err')
          })
        })
      }).catch(err => {
        console.log(JSON.stringify(err))
      })
    })
})
