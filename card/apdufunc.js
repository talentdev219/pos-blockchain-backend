var methods = {
respApdu: function(reader, arrBuf, resLen, protocol){
  var argLen = arguments.length;
  return new Promise(function(resolve, reject){
      reader.transmit(new Buffer(arrBuf), resLen, protocol, function callback(err, data){
        if(err){
          console.log("[err]", err);
          var error={
	    "err" : err
	  };
	  resolve(error);
          reject(err);
        } else {
		var resp = {
		 "resp0" : data[data.length-2].toString(16),
		 "resp1" : data[data.length-1].toString(16),
		 "msg" : data
		}
	  resolve(resp);
        }
      });
  });
},

respApduSeq: function(prev, reader, arrBuf, resLen, protocol, printString, message){
  return new Promise(function(resolve, reject){
    if(prev.toString(16) == 61 || prev.toString(16) == 90){
      reader.transmit(new Buffer(arrBuf), resLen, protocol, function callback(err, data){
        if(err){
          console.log("[err]", err);
          var error={
            "err" : err
  	  }
  	  resolve(error);
          reject(err);
        } else {
	  var resp = {
	    resp0 : data[data.length-2].toString(16),
	    resp1 : data[data.length-1].toString(16),
	    data : data.slice(0, data.length-2)
	  }
	  if(resp.resp0 === "90"){
            if(resp.data.length > 1)
              console.log("[data]", resp.data+"");
	    else
	      console.log("[data]", resp.data);
	  } else if(resp.resp0 === "61") {
            console.log("[resp]", resp.resp0, resp.resp1, resp.data+"", message);
	  }
	}
            resolve(resp);
      });
    } 
  });
}

}

exports.func = methods;
