# script-link-html-webpack-plugin
add script prefix to js script src,use with html-webpack-plugin.


Installation
------------
You must be running webpack on node 0.12.x or higher

Install the plugin with npm:
```shell
$ npm install --save-dev script-link-html-webpack-plugin
```

Basic Usage
-----------
in webpack production mode

```javascript
    new ScriptLinkPlugin({
      preffix: 'htttp:xxx.com',
      suffix:'?v='+Date.now(),
      pattern:{
        regex:/assets/,
        replce:'myassets'
      },
      img:true
    })
```

src in html script tag like `/assets/js/index.js` will be `http:xxx.com/myassets/js/index.js?v=1522223212`.

support tag includes `script`,`link` as defalt ,img tag has to set `img` option to true.
