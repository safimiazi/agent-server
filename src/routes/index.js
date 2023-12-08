const { exampleDataApi, donourInfo } = require('../api')


const router = require('express').Router()

router.get('/data/:id',exampleDataApi)


router.get('/donurs',donourInfo)


module.exports = router