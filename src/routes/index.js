const express = require("express");
const router = express.Router();

const {
    getCountries,
    getRequiredSalesRepList,
    getOptimalList
} = require("../controllers/index")

router.get("/countries", getCountries)

router.get("/optimal", getOptimalList)

router.get("/salesrep", getRequiredSalesRepList)

module.exports = router