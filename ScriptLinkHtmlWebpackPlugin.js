const path = require('path');
const mkdirp = require('mkdirp');
const fs = require('fs');
const { EVENT, PLUGIN } = require('./libs/constants.js');

const regexStr = /(assets\/.+?")/;

class ScriptLinkHtmlWebpackPlugin{
    constructor(options){
        this.options = options || {};
        if (!this.options.scriptPre) throw ('配置必须指定一个地址前缀')
        this.scriptPre = this.options.scriptPre;
    }

    apply(compiler) {
        const compile = this.compilationCallback.bind(this);
        if (compiler.hooks) {
            compiler.hooks.compilation.tap(PLUGIN, compile);
        } else {
            compiler.plugin('compilation', compile);
        }

    }
    
    compilationCallback(compilation) {
        const alterAssetTags = this.alterAssetTagsCallback.bind(this, compilation);

        if (compilation.hooks) {
            compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync(PLUGIN, alterAssetTags)  
        } else {
            compilation.plugin(EVENT, alterAssetTags);
        }
    }

    alterAssetTagsCallback(compilation, htmlPluginData, callback){

        const webpackHtmlFilename = htmlPluginData.outputName;
        console.log('修改html文件:', webpackHtmlFilename);
        
        this.processTags(compilation, regexStr, htmlPluginData);
        console.log(htmlPluginData)
        callback(null, htmlPluginData)

    }

    processTags (compilation, regexStr, pluginData) {
        var self = this;

        var body = [];
        var head = [];

        var regex = new RegExp(regexStr);

        pluginData.head.forEach(function (tag) {
            head.push(self.processTag(compilation, regex, tag));
        });

        pluginData.body.forEach(function (tag) {
            body.push(self.processTag(compilation, regex, tag));
        });

    };

    processTag(compilation, regex, tag){

        if(tag.tagName == 'script'){

            tag.attributes.src = this.scriptPre + tag.attributes.src;
            
        } else if (tag.tagName === 'link'){

            tag.attributes.href = this.scriptPre + tag.attributes.href;
        }
        console.log(tag)
    }

}

module.exports = ScriptLinkHtmlWebpackPlugin;