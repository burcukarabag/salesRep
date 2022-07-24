const Countries = require("../schemas/countriesSchema")
const request = require('request');

const getCountries = (async (req, res, next) => {
    try {
        let query = Countries.find({}).select("-_id")
        if (req.query.region) {
            query.where({region: req.query.region})
        }
        res.status(200).json(await query)
    } catch (err) {
        next(err)
    }
})

const getRequiredSalesRepList = (async (req, res, next) => {
    try {
        let regionList = await getRegionList();
        regionList = regionList.map(({region, minSalesReq, maxSalesReq}) => {
            return {region, minSalesReq, maxSalesReq}
        })
        res.status(200).json(regionList)
    } catch (error) {
        next(error)
    }
})

const getRegionList = async () => {
    let countries = await getCountriesWithEndpoint();
    let regionList = []
    for (const country of countries) {
        let regionIndex = regionList.findIndex(regionItem => regionItem.region === country.region)
        if (regionIndex === -1) {
            regionList.push({
                region: country.region,
                countryList: [country.name],
                countryCount: 1,
                minSalesReq: 1,
                maxSalesReq: 1
            })
        } else {
            regionList[regionIndex].countryList.push(country.name)
            regionList[regionIndex].countryCount = regionList[regionIndex].countryList.length
            regionList[regionIndex].minSalesReq = Math.trunc(regionList[regionIndex].countryCount / 7) + (regionList[regionIndex].countryCount % 7 ? 1 : 0);
            regionList[regionIndex].maxSalesReq = Math.trunc(regionList[regionIndex].countryCount / 3)
        }
    }
    return regionList;
}

const getOptimalList = (async (req, res, next) => {
    try {
        let regionList = await getRegionList();
        let optimalSalesRepList = []
        for (let i = 0; i < regionList.length; i++) {
            let optimalCount = Math.trunc(regionList[i].countryCount / regionList[i].minSalesReq);
            let optimalCountList = spreadOptimalCount(regionList[i].countryCount, optimalCount)
            optimalSalesRepList = getOptimalSalesRepList({
                region: regionList[i],
                optimalCountList,
                optimalSalesRepList
            })
        }

        res.status(200).json(optimalSalesRepList)
    } catch (error) {
        next(error)
    }
})

const getOptimalSalesRepList = ({region, optimalCountList, optimalSalesRepList}) => {
    let countries = [];
    for (let country of region.countryList) {
        countries.push(country)
        region.countryList = region.countryList.filter(countryItem => countryItem !== country)
        if (countries.length === optimalCountList[0]) {
            optimalSalesRepList.push({
                region: region.region,
                countryList: countries,
                countryCount: countries.length
            })
            countries = []
            optimalCountList.shift();
        }
    }

    return optimalSalesRepList
}

const spreadOptimalCount = (countryCount, optimalCountryCount) => {
    let countList = []
    if (countryCount % optimalCountryCount === 0) {
        for (let i = 0; i < optimalCountryCount; i++)
            countList.push(countryCount / optimalCountryCount)
    } else {
        let remainder = optimalCountryCount - (countryCount % optimalCountryCount);
        let remainder_ = Math.floor(countryCount / optimalCountryCount);
        for (let i = 0; i < optimalCountryCount; i++) {
            if (i >= remainder)
                countList.push(remainder_ + 1)
            else
                countList.push(remainder_)
        }
    }
    return countList;
}

const getCountriesWithEndpoint = async (region) => {
    const requestOptions = {
        url: region ? `${config.api.url}:${config.api.port}/countries?region=${region}` : `${config.api.url}:${config.api.port}/countries`,
        method: 'GET'
    };

    return new Promise((resolve, reject) => {
        request(requestOptions, (err, res, body) => {
            if (err) {
                reject(err)
            }
            resolve(JSON.parse(body));
        });
    })
}

module.exports = {
    getCountries,
    getRequiredSalesRepList,
    getOptimalList
}