const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

/* middleware - that lay between frontend and backend */
// converting the response to JSON
app.use(express.json());
app.use(cors());

// all currencies
app.get("/getAllCurrencies", async (req, res) => {
  // making url from API endpoint
  const nameURL = `https://openexchangerates.org/api/currencies.json?app_id=e8ac89aa5ebfbe2bc0485ff2`;

  // sending a request to url
  try {
    // calling api endpoint and catching
    // since we calling api endpoint this should be async
    const namesResponse = await axios.get(nameURL);
    const nameData = namesResponse.data;

    return res.json(nameData);
  } catch (error) {
    console.error(error);
  }
});

// get the target amount
app.get("/convert", async (req, res) => {
  const {
    date,
    sourceCurrency,
    targetCurrency,
    amountInSourceCurrency,
    amountInTargetCurrency,
  } = req.query;

  try {
    const dataURL = `https://openexchangerates.org/api/historical/${date}.json?app_id=e8ac89aa5ebfbe2bc0485ff2`;
    const dataResponse = await axios.get(dataURL);
    const rates = dataResponse.data.rates;

    // rates
    const sourceRate = rates[sourceCurrency];
    const targetRate = rates[targetCurrency];

    //final calculation
    const targetAmount = (targetRate / sourceRate) * amountInSourceCurrency;

    return res.json(targetAmount);
  } catch (error) {
    console.error(error);
  }
});

// listen to a port
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
