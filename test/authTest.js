/**
 * Created by Glenn on 2016-03-01.
 */
var supertest = require("supertest");
var assert = require("assert");

// This agent refers to PORT where program is runninng.
var server = supertest.agent("http://localhost:3000");

// UNIT test begin

describe("Auth Unit Test",function(){

    // #1 should return home page
    it("should return status code 200",function(done){
        var login = {
            username : "Glenn",
            password : "zzzzz"
        };

        // calling home page api
        server.post("/auth")
            .send(login)
            .expect(200) // THis is HTTP response
            .end(function(err,res){
                // HTTP status should be 200
                assert.equal(200, res.status);
                done();
            });
    });

    it("should return status code 500",function(done){
        var login = {
        };

        // calling home page api
        server.post("/auth")
            .send(login)
            .expect(500) // THis is HTTP response
            .end(function(err,res){
                // HTTP status should be 200
                assert.equal(500, res.status);
                done();
            });
    });

    it("should return status code 403",function(done){
        var login = {
            username : "Glenn",
            password : "abcdef"
        };

        // calling home page api
        server.post("/auth")
            .send(login)
            .expect(403) // THis is HTTP response
            .end(function(err,res){
                // HTTP status should be 200
                assert.equal(403, res.status);
                done();
            });
    });

});
