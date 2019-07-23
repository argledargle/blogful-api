const { expect } = require('chai')
const supertest = require('supertest')

//this is where we can add additional features to chai if we want

global.expect = expect
global.supertest = supertest