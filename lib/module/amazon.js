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
        responseGroup: 'ItemAttributes,Images,Offers',
        domain: 'webservices.amazon.com',
        keywords: args
      })
      .then(function (results) {
        var attachments = [],
            fields = [],
            random

        if (results && results.length > 0) {
          random = _.random(results.length - 1)

          // build price field
          if (results[random].OfferSummary[0].LowestNewPrice && results[random].OfferSummary[0].LowestNewPrice[0].FormattedPrice[0]) {
            fields.push({
              title: 'price',
              value: results[random].OfferSummary[0].LowestNewPrice[0].FormattedPrice[0],
              short: true
            })
          }

          // build category field
          if (results[random].ItemAttributes[0].ProductGroup) {
            fields.push({
              title: 'product group',
              value: results[random].ItemAttributes[0].ProductGroup[0],
              short: true
            })
          }

          // build attachment
          var attachment = {
            color: config.get('modules.amazon.attachment-color'),
            fallback: results[random].ItemAttributes[0].Title[0],
            title: results[random].ItemAttributes[0].Title[0],
            title_link: results[random].DetailPageURL[0],
            text: results[random].ItemAttributes[0].Feature ? results[random].ItemAttributes[0].Feature.join('\n') : 'No description',
            thumb_url: results[random].SmallImage[0].URL[0],
            fields: fields
          }

          attachments.push(attachment)

          channel.postMessage({
            attachments: attachments
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
    awsId: config.get('modules.amazon.aws-access-key-id'),
    awsSecret: config.get('modules.amazon.aws-secret-key'),
    awsTag: config.get('modules.amazon.aws-tag')
  })
}

module.exports = Amazon
