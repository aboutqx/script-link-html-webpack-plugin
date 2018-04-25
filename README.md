# script-link-html-webpack-plugin
add script prefix to js script src,use with html-webpack-plugin.

##usage

in webpack production mode

    new ScriptLinkPlugin({
      scriptPre: 'htttp:xxx.com'
    })

src in html like '/assets/js/index.js' will be 'htttp:xxx.com/assets/js/index.js'
