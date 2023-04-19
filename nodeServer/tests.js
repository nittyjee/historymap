const puppeteer = require('puppeteer');
const chai = require('chai');
const chaiHttp = require('chai-http');
const router = 'http://localhost:8088/';
const should = chai.should();

let browser, page;
chai.use(chaiHttp);

before (async () => {
  browser = await puppeteer.launch({ headless: false });
  page = await browser.newPage();
 //  await page.goto('http://localhost:8088/');
});

describe('Testing Hello World', async () => {
  it('It tests the "/hello_world end point, expects the response "hi!"', async () => {
    await new Promise ((resolve, reject) => {
      chai.request(router).get('hello_world').end((err, res) => {
        if (err) reject(err);
        res.should.have.status(200);
        res.text.should.be.eql('hi!');
      });
    });
  });
});

after (async () => {
  browser.close();
});