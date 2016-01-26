'use strict'

var _ = require('lodash')
var config = require('config')
var AmazonProductApi = require('amazon-product-api')

var client

function Amazon() {
  this.Commands = {
    amazon: function (slack, message, channel, user, args) {
      client.itemSearch({
        condition: 'New',
        searchIndex: 'All',
        responseGroup: 'ItemAttributes,Images',
        domain: 'webservices.amazon.com',
        keywords: args
      })
      .then(function (results) {
        var random, fields = []

        if (results && results.length > 0) {
          random = _.random(results.length - 1)

          if (results[random].ItemAttributes[0].ListPrice && results[random].ItemAttributes[0].ListPrice[0].FormattedPrice) {
            fields.push({
              title: 'price',
              value: results[random].ItemAttributes[0].ListPrice[0].FormattedPrice[0],
              short: true
            })
          }

          if (results[random].ItemAttributes[0].Manufacturer) {
            fields.push({
              title: 'manufacturer',
              value: results[random].ItemAttributes[0].Manufacturer[0],
              short: true
            })
          }

          channel.postMessage({
            attachments: [
              {
                color: config.get('modules.amazon.attachment-color'),
                fallback: results[random].ItemAttributes[0].Title[0],
                title: results[random].ItemAttributes[0].Title[0],
                title_link: results[random].DetailPageURL[0],
                text: results[random].ItemAttributes[0].Feature ? results[random].ItemAttributes[0].Feature.join('\n') : 'No description',
                thumb_url: results[random].SmallImage[0].URL[0],
                fields: fields
              }
            ]
          })
        } else {
          channel.send('No results found')
        }
      })
      .catch(function (err) {
        console.error('error: ', typeof (err) === 'object' ? JSON.stringify(err) : err)
      })
    }
  }
}

Amazon.prototype.init = function () {
  client = AmazonProductApi.createClient({
    awsId: config.get('modules.amazon.aws-account-id'),
    awsSecret: config.get('modules.amazon.aws-secret-key'),
    awsTag: config.get('modules.amazon.aws-tag')
  })
}

module.exports = Amazon
