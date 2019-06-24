var pcsc = require('pcsclite');
var request = require('request');

var apdu = require('./apdufunc.js');

var pcsc = pcsc();
pcsc.on('reader', function(reader) {

//console.log("host in base64", Buffer.from('http://192.168.0.11:5000').toString('base64'));
  console.log('New reader detected', reader.name);
  reader.on('error', function(err) {
    console.log('Error(', this.name, '):', err.message);
  });

  reader.on('status', function(status) {
    console.log('Status(', this.name, '):', status);
    // check what has changed

    var changes = this.state ^ status.state;
    if (changes) {
      if ((changes & this.SCARD_STATE_EMPTY) && (status.state & this.SCARD_STATE_EMPTY)) {
        console.log("card removed"); // card removed
        reader.disconnect(reader.SCARD_LEAVE_CARD, function(err) {
          if (err) {
            console.log("card state empty [err] : " + err);
          } else {
            console.log('Disconnected');
          }
        });
      } else if ((changes & this.SCARD_STATE_PRESENT) && (status.state & this.SCARD_STATE_PRESENT)) {
        console.log("card inserted"); // card inserted
	var resp;
        reader.connect({ share_mode : this.SCARD_SHARE_SHARED }, function(err, protocol) {
          if (err) {
            console.log("card state present [err] : " + err);
          } else {
	    console.log("Reader:", reader);
            console.log('Protocol(', reader.name, '):', protocol);
	    var respReader = apdu.func.respApdu(reader, new Buffer([0x00, 0xA4, 0x00, 0x00, 0x02, 0x3F, 0x00]),255, protocol);
var buf = [[0x00, 0xA4, 0x00, 0x00, 0x02, 0x10, 0x01],
	[0x00, 0xA4, 0x00, 0x00, 0x02, 0x01, 0x01],
	[0x00, 0xB0, 0x00, 0x00, 0xFD],
	[0x00, 0xA4, 0x00, 0x00, 0x02, 0x01, 0x07],
	[0x00, 0xB0, 0x00, 0x00, 0x01]];
var msg = ["selecting DF",
	"selecting EF1",
	"read EF1",
	"selecting EF7",
	"read EF7"];

	    respReader
	    .then(result => {
	    console.log("result",result);
	    console.log("resp reader",respReader);
	      for(let i=0; i<5; i++){
	      console.log("result",result[result.length-2].toString(16));
	       respReader += apdu.func.respApduSeq(
	       result,
	       reader,
	       new Buffer(buf[i]),		//select DF
	       255,
	       protocol
	       ,false,
	       msg[i]
	       );
	      }
	      console.log(respReader.message);
	       return respReader;
	    })
	    .catch(err => {
//	      return next(err);
	      return (err);
	    })
	    .finally(result => {
	    //  console.log("finale",result);
	    //don't know what to do
	    /*
	      try{
	        reader.close();
	        pcsc.close();
	      } catch(e) {
	        console.log("reader err:", e);
	      }
	    */
	    })

//	    setTimeoutresult(
//	      function(){
       console.log("send to outside world", resp)
//	      },1000);
          }
        });
	console.log("see resp?", resp);
      }
    }
  });

  reader.on('end', function() {
    console.log('Reader',  this.name, 'removed');
    reader.close();
    pcsc.close();
  });
});

pcsc.on('error', function(err) {
  console.log('PCSC error', err.message);
});
/*
function msgResp(data) {
  console.log("dataaaaaaaaaaa", data);
  //console.log("err ", err);
  var result = "";
    result = msgResp(data);
    console.log("respon received", result);
    reader.close();
  return result;
}
*/
function respApdu(reader, arrBuf, resLen, protocol){
//function respApdu(){
  var argLen = arguments.length;
//  console.log("arg:", argLen);
  return new Promise(function(resolve, reject){
    if (argLen === 4){
      reader.transmit(new Buffer(arrBuf), resLen, protocol, function callback(err, data){
        if(err){
          console.log("[err]", err);
          var error={
	    "err" : err
	  };
	  resolve(error);
          reject(err);
        } else {
          console.log("[data]", data);
          resolve(data);
        }
      });
    }
    else if(argLen === 5){
      reader.transmit(new Buffer(arrBuf), resLen, protocol, function callback(err, data){
        if(err){
          console.log("[err]", err);
          var error={
	    "err" : err
	  };
	  resolve(error);
          reject(err);
        } else {
//          console.log("[data]", data);
          resolve(data);
        }
      });
    }  
    else {
      return
      var error={
        "err" : "respApdu.length argument not valid"
      };
      resolve(error);
      reject(err);
    }
  });
};

/*---*/
function respApduSeq(prev, reader, arrBuf, resLen, protocol, printString, message){
//function respApduSeq(prev, reader, arrBuf, resLen, protocol){
//  var argLen = arguments.length;
//  console.log("arg:", argLen);
  return new Promise(function(resolve, reject){
//      console.log("prev",prev[prev.length-2].toString(16));
      if(prev[prev.length-2].toString(16) == 61 || prev[prev.length-2].toString(16) == 90){
        reader.transmit(new Buffer(arrBuf), resLen, protocol, function callback(err, data){
          if(err){
            console.log("[err]", err);
            var error={
  	      "err" : err
  	    }
  	    resolve(error);
            reject(err);
          } else {
	    if(data.length > 3){
	      //console.log("len ", data.length);
	      if(printString === true){
                console.log("[data]", data+"", message);
		var resp = {
		 "resp0" : data[data.length-2],
		 "resp1" : data[data.length-1],
		 "msg" : data.splice(data.length-2, 2)
		}
	      }
	      //else 
                console.log("[data]", data, message);
	    } else {
              console.log("[data]", data, message);
	    }
            resolve(data);
//            resolve(resp);
          }
        });
      } 
  });
};

var tanggalKuliah = Date();
var cron = require('node-cron');

var schDate = '';
var schHour = '19';
var schMinute = '26';

// validasi format cron
// cron.validate('59 4 * * *');

// pemanggilan fungsi untuk mendapatkan daftar peserta kelas (dipanggil saat perkuliahan pada satu hari sebelum dimulai)
cron.schedule('28 19 * * *', function(){
//cron.schedule(minute+' '+hour+' * * *', function(){
  const timeOptions = {
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
    hour12: false,
    timeZone: 'Asia/Jakarta'
  };

  //tanggalKuliah = 'Tue Sep 04 2018 09:47:10 GMT+0700 (Indochina Time)';
  tanggalKuliah = 'Mon May 21 2018 00:47:10 GMT+0700 (Indochina Time)';
  //var tStamp = new Intl.DateTimeFormat(['ban', 'id'], timeOptions).format(Date.parse('2018-05-21 00:00:01'));
  //var tStamp = new Intl.DateTimeFormat(['ban', 'id'], timeOptions).format(Date.parse(tanggalKuliah));
  console.log("tanggal kuliah", tanggalKuliah);
  //console.log("tStamp", tStamp);
  //daftarPesertaKelas({roomid : 1, roomtimestamp : tStamp});
  ws.func.daftarPesertaKelas({roomid : 1, roomtimestamp : tanggalKuliah});
  //daftarPesertaKelas({roomid : 1, roomtimestamp : '2018-05-21'});
  //daftarPesertaKelas({roomid : 1, roomtimestamp : 'Mon May 21 2018 09:47:10 GMT+0700 (Indochina Time)'});
  console.log('running a task get class participants every 04:59 everydays');
});

// pemanggilan baca file mahasiswa
// rekapKehadiranMahasiswa(13512006, '13:07:00');

// pemanggilan baca file dosen
// rekapKehadiranDosen(196312111990011002, '16:24:00');

// dipanggil untuk update ke server
//cron.schedule('39 10 * * *', function(){
//  rekapKehadiranDosen(196312111990011002, '16:24:00');
//  console.log(Date());
//  console.log('rekap kehadiran created!');
//});

// dipanggil untuk update ke server
//cron.schedule('40 10 * * *', function(){
//  updateKehadiranMahasiswa();
//  updateKehadiranDosen();
//  console.log(Date());
//  console.log('running a task update to server every hours');
//});
