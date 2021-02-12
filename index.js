const express = require('express');
const Nexmo = require('nexmo');
const bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT
const host= process.env.HOST
const address=process.env.ADDRESS;
const from = process.env.NAME;
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


const sendMessage=(to, text)=>{
  const nexmo = new Nexmo({
    apiKey: process.env.NEXMO_API_KEY,
    apiSecret: process.env.NEXMO_API_SECRET,
  });

  const options={
    // If true, log information to the console
    debug: true,
  };

  const callback=(err, response) => {
    if (err) {
      console.log(`Error:`,err);
    } else {
      console.dir(`Success:`,response);
    }
  }

  nexmo.message.sendSms(
    from, 
    to, 
    text, 
    options,
    callback
  );
}


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/requestWater/:waterTanks', (req, res) => {
  const numberWaterTanks=req.params.waterTanks;
  const waterPhoneNumber=process.env.WATER_MOBILE_TO;
  const waterMessage=`Buenas tardes Sr. Roberto. Podria traerme ${numberWaterTanks} garrafones Bonafont a ${address}. Gracias ${from}.`;
  sendMessage(waterPhoneNumber, waterMessage );
  res.send();
})

app.post('/requestFood', (req, res) => {
  const numberOfLunch=req.body.numberOfLunch;
  const lunches=req.body.lunches;
  let lunchText="";
  lunches.map((lunch, i)=>{
    lunchText+= `Comida ${i+1}: `;
    lunchText+= `${lunch.entry}, ${lunch.main}, ${lunch.salad}, ${lunch.dessert}. `
  });
  const lunchPhoneNumber=process.env.WATER_MOBILE_TO;
  const lunchMessage=`Buenas tardes. Me gustaria pedir ${numberOfLunch} comidas corridas a ${address}. ${lunchText} Gracias ${from}.`;
  sendMessage(lunchPhoneNumber, lunchMessage );
  res.send({lunchMessage});
})


app.route('/webhooks/inbound-sms')
  .get(handleInboundSms)
  .post(handleInboundSms)

function handleInboundSms(request, response) {
  const params = Object.assign(request.query, request.body)
  console.log(params)
  response.status(204).send()
}

app.route('/webhooks/outbound-sms')
  .get(handleOutboundSms)
  .post(handleOutboundSms)

function handleOutboundSms(request, response) {
  const params = Object.assign(request.query, request.body)
  console.log(params)
  response.status(204).send()
}


app.listen(port, host, () => {
  console.log(`Example app listening at http://${host}:${port}`)
})