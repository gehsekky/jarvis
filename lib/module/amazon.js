'use strict'

const _                = require('lodash')
const config           = require('config')
const JarvisModule     = require('jarvis-module')
const AmazonProductApi = require('amazon-product-api')

let client

class Amazon extends JarvisModule {
  init(bot) {
    client = AmazonProductApi.createClient({
      awsId: config.get('modules.amazon.aws-access-key-id'),
      awsSecret: config.get('modules.amazon.aws-secret-key'),
      awsTag: config.get('modules.amazon.aws-tag')
    })
  }

  loadCommands(bot) {
    bot.commands.amazon = function (message, channel, user, args) {
      client.itemSearch({
        condition: 'New',
        searchIndex: 'All',
        responseGroup: 'ItemAttributes,Images,Offers',
        domain: 'webservices.amazon.com',
        keywords: args
      })
      .then(function (results) {
        let attachments = [],
            fields = [],
            random

        if (!results) {
          channel.send('No results found')
        }

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
        attachments.push({
          color: config.get('modules.amazon.attachment-color'),
          fallback: results[random].ItemAttributes[0].Title[0],
          title: results[random].ItemAttributes[0].Title[0],
          title_link: results[random].DetailPageURL[0],
          text: results[random].ItemAttributes[0].Feature ? results[random].ItemAttributes[0].Feature.join('\n') : 'No description',
          thumb_url: results[random].SmallImage[0].URL[0],
          fields: fields
        })

        channel.postMessage({
          attachments: attachments
        })
      })
      .catch(console.error)
    }
  }
}

module.exports = Amazon
