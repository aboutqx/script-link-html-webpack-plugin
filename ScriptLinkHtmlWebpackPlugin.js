const path = require('path');
const fs = require('fs');
const { EVENTALTER, EVENTAFTER, PLUGIN } = require('./libs/constants.js');

const regexStr = /<img\s+src="?(.+?)"?\s/gi;// \s 匹配空白

class ScriptLinkHtmlWebpackPlugin {
    constructor(options) {
        if (!options.prefix && !options.suffix && !options.pattern) throw ('must set a item.')
        this.options = {
            prefix: '',
            suffix: '',
            pattern: null,
            img: false
        };
        Object.assign(this.options, options)
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
        const postHtml = this.postHtmlCallback.bind(this, compilation);

        if (compilation.hooks) {
            compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync(PLUGIN, alterAssetTags)
            if (this.options.img) compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tapAsync(PLUGIN, postHtml)
        } else {
            compilation.plugin(EVENTALTER, alterAssetTags);
            if (this.options.img) compilation.plugin(EVENTAFTER, postHtml);
        }
    }

    alterAssetTagsCallback(compilation, htmlPluginData, callback) {

        const webpackHtmlFilename = htmlPluginData.outputName;
        console.log('修改html文件:', webpackHtmlFilename);

        this.processTags(compilation, htmlPluginData);
        console.log(htmlPluginData)
        callback(null, htmlPluginData)

    }

    processTags(compilation, pluginData) {

        pluginData.head.forEach((tag) => {
            this.processTag(compilation, tag);
        });

        pluginData.body.forEach((tag) => {
            this.processTag(compilation, tag);
        });

    };

    processTag(compilation, tag) {
        let t;
        if (tag.tagName == 'script') {
            t = tag.attributes.src
            t = this.processTagPattern(t)
            tag.attributes.src = this.options.prefix + t + this.options.suffix;

        } else if (tag.tagName === 'link') {
            t = tag.attributes.href
            t = this.processTagPattern(t)
            tag.attributes.href = this.options.prefix + t + this.options.suffix;
        }

        console.log(tag)
    }

    processTagPattern(str) {
        if (this.options.pattern) {
            const pattern = this.options.pattern
            if (!(pattern.regex.constructor == RegExp)) throw ("regex argument is not a regex expression.")
            return str.replace(pattern.regex, pattern.replace)
        } else
            return str

    }
    postHtmlCallback(compilation, htmlPluginData, callback) {
        let t = htmlPluginData.html
        console.log(t)
        t = t.replace(regexStr, "<img src=" + this.options.prefix + "$1" + this.options.suffix + " ")
        htmlPluginData.html = this.processTagPattern(t)
        callback(null, htmlPluginData)
    }

}

module.exports = ScriptLinkHtmlWebpackPlugin;