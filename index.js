const  LotoHelper= require('./btclotohelper')
var unixTimeZero = Date.parse('01 Jan 1970 00:00:00 GMT');
var unixTime = Date.parse('3 Jan 2019 18:15:05 GMT');

console.log(unixTimeZero);
console.log(unixTime);
var n =1540968488762+800*1000;

console.log(n);
btcStatusReg = new LotoHelper('589c7c7a71a54992bae20df00abe22d0');
//btcStatusReg.getlastblock();
setInterval(function(){
    btcStatusReg.getblockheightbytime(n).then(console.log).catch(console.error);
},1000);

setInterval(function(){
     number_of_confirm=3;
     btcStatusReg.getWinerBlock(number_of_confirm).then(blocks=>{
       // console.log(blocks);
       let res={
            hash_res:blocks.blocks[0].hash,
            height:blocks.blocks[0].height,
            timestamp:blocks.blocks[0].time*1000,
            receive_time:blocks.blocks[0].received_time,
            source:'blockchain.info'
       }
       let str = JSON.stringify(res);
       console.log('====================');
       console.log(str);

       
    }).catch(console.error);
},5000);
