const { exampleDataApi } = require('../api')

const router = require('express').Router()

router.get('/data/:id',exampleDataApi)


module.exports = router