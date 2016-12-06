var chai = require('chai');
var route = require('../Graphlr/PushRoutes');
var should = chai.should();

describe('Routes', function(){
    it('prepr:bac:source:33085175 should match prepr:*', function(done){
        route.match('prepr:bac:source:33085175', 'prepr:*').should.equal(true);
        done();
    });
    it('prepr:* should match prepr:bac:source:33085175', function(done){
        route.match('prepr:*', 'prepr:bac:source:33085175').should.equal(true);
        done();
    });
    it('prepr:12345:source:12345 should match prepr:*:source:12345', function(done){
        route.match('prepr:12345:source:12345', 'prepr:*:source:12345').should.equal(true);
        route.match('prepr:*:source:12345', 'prepr:12345:source:12345').should.equal(true);
        done();
    });
    it('prepr:12345:source:12345 should not match prepr:*:source:1234', function(done){
        route.match('prepr:12345:source:1234', 'prepr:*:source:12345').should.not.equal(true);
        route.match('prepr:*:source:12345', 'prepr:12345:source:1234').should.not.equal(true);
        done();
    });

    it('prepr:12345:* should match prepr:12345:abc', function(done){
        route.match('prepr:12345:*', 'prepr:12345:abc').should.equal(true);
        route.match('prepr:12345:abc', 'prepr:12345:*').should.equal(true);
        done();
    });

    it('prepr:12345:test should match prepr:12345:test', function(done){
        route.match('prepr:12345:test', 'prepr:12345:test').should.equal(true);
        done();
    });
});