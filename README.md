# script-link-html-webpack-plugin
add script prefix to js script src,use with html-webpack-plugin.

##usage

in webpack production mode

    new ScriptLinkPlugin({
      preffix: 'htttp:xxx.com',
      suffix:'v='+Date.now(),
      pattern:{
        regex:/assets/,
        replce:'myassets'
      },
      img:true
    })

src in html script tag like '/assets/js/index.js' will be 'http:xxx.com/myassets/js/index.js'.

support tag includes `script`,`link` as defalt ,`img` has to set img flag to true.
