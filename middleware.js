var Session = function(){

};

var uid = require('uid-safe').sync;

var redis = require("redis");

module.exports = function query(options) {


    var cookie_name = options.sessionId;
    var expire_time = options.maxAge;
    var client = redis.createClient(options.connection);

    return function mySession(req, response, next){
        var headers = req.headers;
        console.log('cookie : ',headers);
        console.log('cookie : ',headers.cookie);

        var cookies = {};

        if(headers.cookie != null){
            var cookieArr = headers.cookie.split('; ');
            var cookieRegex = /^(\S+)=(\S+)$/;
            for(var i in  cookieArr){
                if (cookieRegex.test(cookieArr[i])) {
                    var cookieParam = cookieRegex.exec(cookieArr[i]);
                    cookies[cookieParam[1]] = cookieParam[2];
                }
            }
        }

        var sess = {};



        req.__defineGetter__('session', function(){
            return  JSON.parse(sess);
        });

        req.__defineSetter__('session', function(value){

            sess = JSON.stringify(value);

            if (value == null){
                console.log('delete');
                client.del("sessionId",function(err, res){
                    if (err){
                        console.log('err : ',err);
                    }
                });
            } else {

                client.setex(sessionId, expire_time, JSON.stringify(value),function(err, res){
                    if (err){
                        console.log('err : ',err);
                    } else {
                        console.log('set cookie success');
                    }
                });
            }

        });



        if  (cookies[cookie_name]){
            var sessionId = cookies[cookie_name];
            client.get(sessionId, function(err, res){
                if (err){
                    console.log('err : ',err);
                }
                console.log('session : ', res);
                next();
            });
        } else {
            var sessionId = uid(24);
            response.cookie(cookie_name, sessionId);
            next();
        }

    };
};
