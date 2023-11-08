const chai = require("chai")
var should = chai.should()
const chaiHttp = require("chai-http")
const app = require("../app")

chai.use(chaiHttp);

describe('Phonebooks', () => {

    // ini untuk get data
    it("Should success to get all the Phonebooks on /api/phonebooks GET", (done) => {
        chai.request(app)
            .get('/api/phonebooks')
            .query({ keyword: 'father' })
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.should.be.a('object');
                res.body.should.have.property('phonebooks')
                res.body.phonebooks.should.be.a('array')
                res.body.phonebooks[0].should.be.a('object')
                res.body.phonebooks[0].should.have.property('id')
                res.body.phonebooks[0].id.should.equal(1)
                res.body.phonebooks[0].should.have.property('name')
                res.body.phonebooks[0].name.should.equal('father')
                res.body.phonebooks[0].should.have.property('phone')
                res.body.phonebooks[0].phone.should.equal('085323999979')
                res.body.phonebooks[0].should.have.property('avatar')
                res.body.phonebooks[0].should.have.property('createdAt')
                res.body.phonebooks[0].createdAt.should.equal('2023-10-28T17:37:55.635Z')
                res.body.phonebooks[0].should.have.property('updatedAt')
                res.body.phonebooks[0].updatedAt.should.equal('2023-10-30T06:27:03.038Z')
                res.body.should.have.property('page')
                res.body.page.should.be.a('number')
                res.body.page.should.equal(1)
                res.body.should.have.property('limit')
                res.body.limit.should.be.a('number')
                res.body.limit.should.equal(10)
                res.body.should.have.property('pages')
                res.body.pages.should.be.a('number')
                res.body.pages.should.equal(1)
                res.body.should.have.property('total')
                res.body.total.should.be.a('number')
                res.body.total.should.equal(1)
                done()
            })
    })

    //ini untuk add data
    it("Should success to Add the phonebooks data /api/phonebooks POST", (done) => {
        chai.request(app)
            .post('/api/phonebooks')
            .send({ name: "Rizal", phone: "081321392526" })
            .end(function (err, res) {
                res.should.have.status(201);
                res.should.be.json;
                res.should.be.a('object');
                res.body.should.have.property("id")
                res.body.should.have.property("name")
                res.body.name.should.equal("Rizal")
                res.body.should.have.property("phone")
                res.body.phone.should.equal("081321392526")
                res.body.should.have.property("avatar")
                res.body.should.have.property("createdAt")
                res.body.should.have.property("updatedAt")
                done()
            })
    })

    //ini untuk delete data
    it("Should success to Delete the phonebooks data /api/phonebooks DELETE", (done) => {
        chai.request(app)
            .delete('/api/phonebooks/8')
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.should.be.a('object');
                res.body.should.have.property("id")
                res.body.id.should.equal(8)
                res.body.should.have.property("name")
                res.body.name.should.equal("Rizals")
                res.body.should.have.property("phone")
                res.body.phone.should.equal("0813213925267")
                res.body.should.have.property("avatar")
                res.body.should.have.property("createdAt")
                res.body.should.have.property("updatedAt")
                done()
            })
    })


    //ini untuk edit data
    it("Should success to Update the phonebooks data /api/phonebooks PUT", (done) => {
        chai.request(app)
            .put('/api/phonebooks/17')
            .send({name: 'Rizals', phone: '0813213925267'})
            .end(function (err, res) {
                res.should.have.status(201);
                res.should.be.json;
                res.should.be.a('object');
                res.body.should.have.property("id")
                res.body.id.should.equal(17)
                res.body.should.have.property("name")
                res.body.name.should.equal("Rizals")
                res.body.should.have.property("phone")
                res.body.phone.should.equal("0813213925267")
                res.body.should.have.property("avatar")
                res.body.should.have.property("createdAt")
                res.body.should.have.property("updatedAt")
                done()
            })
    })

})


/*  .query: untuk search
    .delete: untuk hapus
    .attach: untuk edit
    .send: untuk add
    */