import config from '../config/config'
import qiniuConfig from '../config/qiniu'
import ObjectUtil from './ObjectUtil'
import RestUtil from './RestUtil'
import StringUtil from './StringUtil'
import store from '../vuex/store'

class QiniuUtil {
  /**
   * init uploader function
   * @param  {Object} options:
   *  runtimes: 'html5,flash,html4',      // 上传模式,依次退化
   *  browse_button: 'pickfiles',         // 上传选择的点选按钮，**必需**
   *  // 在初始化时，uptoken, uptoken_url, uptoken_func 三个参数中必须有一个被设置
   *  // 切如果提供了多个，其优先级为 uptoken > uptoken_url > uptoken_func
   *  // 其中 uptoken 是直接提供上传凭证，uptoken_url 是提供了获取上传凭证的地址，如果需要定制获取 uptoken 的过程则可以设置 uptoken_func
   *  // uptoken : '<Your upload token>', // uptoken 是上传凭证，由其他程序生成
   *  // uptoken_url: '/uptoken',         // Ajax 请求 uptoken 的 Url，**强烈建议设置**（服务端提供）
   *  // uptoken_func: function(file){    // 在需要获取 uptoken 时，该方法会被调用
   *  //    // do something
   *  //    return uptoken;
   *  // },
   *  get_new_uptoken: false,             // 设置上传文件的时候是否每次都重新获取新的 uptoken
   *  // downtoken_url: '/downtoken',
   *  // Ajax请求downToken的Url，私有空间时使用,JS-SDK 将向该地址POST文件的key和domain,服务端返回的JSON必须包含`url`字段，`url`值为该文件的下载地址
   *  // unique_names: true,              // 默认 false，key 为文件名。若开启该选项，JS-SDK 会为每个文件自动生成key（文件名）
   *  // save_key: true,                  // 默认 false。若在服务端生成 uptoken 的上传策略中指定了 `sava_key`，则开启，SDK在前端将不对key进行任何处理
   *  domain: '<Your bucket domain>',     // bucket 域名，下载资源时用到，**必需**
   *  container: 'container',             // 上传区域 DOM ID，默认是 browser_button 的父元素，
   *  max_file_size: '100mb',             // 最大文件体积限制
   *  flash_swf_url: 'path/of/plupload/Moxie.swf',  //引入 flash,相对路径
   *  max_retries: 3,                     // 上传失败最大重试次数
   *  dragdrop: true,                     // 开启可拖曳上传
   *  drop_element: 'container',          // 拖曳上传区域元素的 ID，拖曳文件或文件夹后可触发上传
   *  chunk_size: '4mb',                  // 分块上传时，每块的体积
   *  auto_start: true,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传,
   *  //x_vars : {
   *  //    自定义变量，参考http://developer.qiniu.com/docs/v6/api/overview/up/response/vars.html
   *  //    'time' : function(up,file) {
   *  //        var time = (new Date()).getTime();
   *            // do something with 'time'
   *  //        return time;
   *  //    },
   *  //    'size' : function(up,file) {
   *  //        var size = file.size;
   *            // do something with 'size'
   *  //        return size;
   *  //    }
   *  //},
   *  init: {
   *      'FilesAdded': function(up, files) {
   *          plupload.each(files, function(file) {
   *              // 文件添加进队列后,处理相关的事情
   *          });
   *      },
   *      'BeforeUpload': function(up, file) {
   *             // 每个文件上传前,处理相关的事情
   *      },
   *      'UploadProgress': function(up, file) {
   *             // 每个文件上传时,处理相关的事情
   *      },
   *      'FileUploaded': function(up, file, info) {
   *             // 每个文件上传成功后,处理相关的事情
   *             // 其中 info 是文件上传成功后，服务端返回的json，形式如
   *             // {
   *             //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
   *             //    "key": "gogopher.jpg"
   *             //  }
   *             // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html
   *
   *             // var domain = up.getOption('domain');
   *             // var res = parseJSON(info);
   *             // var sourceLink = domain + res.key; 获取上传成功后的文件的Url
   *      },
   *      'Error': function(up, err, errTip) {
   *             //上传出错时,处理相关的事情
   *      },
   *      'UploadComplete': function() {
   *             //队列文件处理完毕后,处理相关的事情
   *      },
   *      'Key': function(up, file) {
   *          // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
   *          // 该配置必须要在 unique_names: false , save_key: false 时才生效
   *
   *          var key = "";
   *          // do something with key here
   *          return key
   *      }
   *  }
   * @return {Object} created qiniu uploader
   */
  static initUploader (options = {}) {
    options.init = options.init || {}
    const fileUploadedFn = options.init.FileUploaded || function () {}
    delete options.init.FileUploaded
    const isCreateKey = 'isCreateKey' in options ? options.isCreateKey : true
    delete options.isCreateKey

    const defaultOptions = {
      runtimes: 'html5,flash,html4', // 上传模式,依次退化
      uptoken_url: `${config.service_domain}/qiniu/uptoken?accesskey=${qiniuConfig.accesskey}&bucketname=${qiniuConfig.bucketname}`, // 若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
      unique_names: false, // 默认 false，key为文件名。若开启该选项，SDK会为每个文件自动生成key（文件名）
      save_key: false, // 默认false。若在服务端生成uptoken的上传策略中指定了sava_key，则开启，SDK在前端将不对key进行任何处理
      domain: qiniuConfig.domain,   // bucket 域名，下载资源时用到，**必需**
      get_new_uptoken: false,  // 设置上传文件的时候是否每次都重新获取新的token
      max_file_size: '15mb', // 最大文件体积限制
      multi_selection: false, // 设置一次只能选择一个文件
      max_retries: 3, // 上传失败最大重试次数
      dragdrop: false, // 开启可拖曳上传
      chunk_size: '4mb', // 分块上传时，每片的体积
      auto_start: true, // 选择文件后自动上传，若关闭需要自己绑定事件触发上传,
      init: {
        FilesAdded: function (up, files) {
          // 读取文件
          // const reader = new window.FileReader()
          // reader.onload = function (e) {
          //   const data = e.target.result
          // }
          // 以DataURL的形式读取文件:
          // reader.readAsText(files[0].getNative())
        },
        BeforeUpload: function (up, file) {},
        UploadProgress: function (up, file) {},
        FileUploaded: function (up, file, info) {
          const domain = up.getOption('domain')
          const res = JSON.parse(info)
          const url = `${domain}/${res.key}`; // 获取上传成功后的文件的Url
          fileUploadedFn.call(up, up, file, info, url)
        },
        Error: function (up, err, errTip) {},
        UploadComplete: function (up, file) {},
        Key: function (up, file) {
          // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
          // 该配置必须要在 unique_names: false , save_key: false 时才生效
          return up.isCreateKey ? `${ObjectUtil.generateObjectId()}${file.name.slice(file.name.lastIndexOf('.'))}` : file.name
        }
      }
    };

    const uploaderOptions = {
      ...defaultOptions,
      ...options,
      init: { ...defaultOptions.init, ...options.init }
    }

    const uploader = window.Qiniu.uploader(uploaderOptions);
    uploader.isCreateKey = isCreateKey
    return uploader;
  }

  static async uploadBase64Image (data) {
    const qiniuConfig = store.state.commonMain.qiniu
    const url = `http://upload.qiniu.com/putb64/-1/key/${StringUtil.base64Encode(ObjectUtil.generateObjectId())}/mimeType/${StringUtil.base64Encode('image/png')}`
    const options = {
      params: {
        isExternalUrl: true
      },
      headers: {
        'Content-Type': 'application/octet-stream',
        'Authorization': `UpToken ${qiniuConfig.uploadToken}`
      }
    }
    const resp = await RestUtil.post(url, data, options)
    return resp && resp.data && resp.data.key ? `${qiniuConfig.domain}/${resp.data.key}` : ''
  }
}

export default QiniuUtil
