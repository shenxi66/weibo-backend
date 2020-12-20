/**
 * @description redis
 * @author liucong
 */
const redis = require('redis')
const { REDIS_CONF } = require('../conf/db')

// 创建客户端
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host)
redisClient.on('errpr', err => {
    console.error('redis error', err)
})

/**
 * 
 * @param {string} key 
 * @param {string} val 
 * @param {number} timeout 过期时间 秒
 */
function set(key, val, timeout = 60 * 60) {
    if (typeof val === 'object') {
        redisClient.set(key, val)
        redisClient.expire(key, timeout)
    }
}

/**
 * 
 * @param {string} key 
 */
function get(key) {
    const promise = new Promise((resolve, reject) => {
        redisClient.get(key, (err, val) => {
            if (err) {
                reject(err)
                return
            }
            if (val === null) {
                resolve(null)
                return
            }

            try {
                resolve(
                    JSON.parse(val)
                )
            } catch (ex) {
                resolve(val)
            }
        })
    })

    return promise
}

module.exports = {
    get,
    set
}

