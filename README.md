# script-link-html-webpack-plugin
add script prefix to js script src.

##usage

in webpack production mode

    new ScriptLinkPlugin({
      scriptPre: '${assetsRootUrl}/vue-app/dist'
    })
