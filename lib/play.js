const moment = require('moment')
let start, end

start = moment.now()

setTimeout(() => {
    end = moment.now()
    console.log(end - start)
}, 1000)