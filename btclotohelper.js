var request = require('request-promise');
var fs = require('fs');
//var path_result='./589c7c7a71a54992bae20df00abe22d0'
//const utc_final=1540782727000;
//var unixTimeZero = Date.parse('01 Jan 1970 00:00:00 GMT');
//var unixTime = Date.parse('30 Oct 2018 00:00:00 GMT');
//const api_get_oneday_blocks ='https://blockchain.info/blocks/'+utc_deadtime_sec.toString()+'?format=json';
const api_get_last_blocks = 'https://blockchain.info/latestblock';
class BTCLotoHelper {
    constructor(saveblock_file_name) {
        this.sfile = saveblock_file_name;
        this.ERR_NOT_ENOUGH_CONFIRM = 'not enough confirm';
        this.ERR_NO_SAVE_RESULT_FILE = 'the file for storing result is not available';
        this.ERR_GENERAL = 'No handle error.See log to get more details';
        this.ERR_OUT_SIDE_OF_WINDOWTIME = 'It is not time to get block';
        
        //this.unixtime = final_unix_time;
    }
    getlastblock() {
        return new Promise(function (resolve, reject) {
            request(api_get_last_blocks, { json: true }, (err, res, body) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(body);
                    // console.log(body);
                }
            });
        });
    }

    getblockbyheight(block_height) {
        let api_get_block_by_height = 'https://blockchain.info/block-height/' + block_height + '?format=json';
        return new Promise(function (resolve, reject) {
            request(api_get_block_by_height, { json: true }, (err, res, body) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(body);
                    //console.log(body);
                }
            });
        });
    }

    getblockheightbytime(utc_final) {
        let path_result = this.sfile;
        let ERR_OUT_SIDE_OF_WINDOWTIME = this.ERR_OUT_SIDE_OF_WINDOWTIME;
        return new Promise(function (resolve, reject) {
            if (fs.existsSync(path_result)) {
                // Do something
                let sv = fs.readFileSync(path_result).toString();
                console.log('File already save before', sv);
                resolve(sv);
             
            } else {
                request(api_get_last_blocks, { json: true }, (err, res, body) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        let utc_now = Date.now();
                        console.log('utc= ' + utc_now + '   height = ' + body.height);
                        if ((utc_now > utc_final) && (utc_now < (utc_final + 60000))) {
                            if (fs.existsSync(path_result)) {
                                // Do something
                                let sv = fs.readFileSync(path_result).toString();
                                console.log('already save before', sv);
                                resolve(sv);
                            } else {
                                let data = { time: utc_now, height: body.height };
                                let sv = JSON.stringify(data);
                                fs.writeFileSync(path_result, sv);
                                console.log('save to data : ', sv);
                                resolve(sv);
                            }

                        } else {
                            console.log(ERR_OUT_SIDE_OF_WINDOWTIME);
                            console.log('remain time in mins :',(utc_final-utc_now)/60000);
                            reject(ERR_OUT_SIDE_OF_WINDOWTIME);
                        }
                    }
                });
            }

        });

    }
    reset_save_result() {
        let path_result = this.sfile;
        if (fs.existsSync(path_result)) {
            // Do something
            fs.unlinkSync(path_result);
        }
    }
    getBlockUnixTime(gmt_unix_time) {
        gmt_unix_time = gmt_unix_time - 1;
        let api_get_oneday_blocks = 'https://blockchain.info/blocks/' + gmt_unix_time.toString() + '?format=json';
        return new Promise(function (resolve, reject) {

            request(api_get_oneday_blocks, { json: true }, (err, res, body) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    console.log(body);
                    resolve(body);
                }
            });
        });

    }

    getWinerBlock(number_of_confirm) {
        let path_result = this.sfile;
        let getlastblock = this.getlastblock;
        let getblockbyheight = this.getblockbyheight;
        let ERR_NO_SAVE_RESULT_FILE = this.ERR_NO_SAVE_RESULT_FILE;
        let ERR_NOT_ENOUGH_CONFIRM = this.ERR_NOT_ENOUGH_CONFIRM;
        let ERR_GENERAL = this.ERR_GENERAL
        return new Promise(function (resolve, reject) {

            if (fs.existsSync(path_result)) {
                // Do something
                let sv = fs.readFileSync(path_result).toString();
                let sav_height = JSON.parse(sv).height;
                let pm1 = getlastblock();
                let pm2 = getblockbyheight(sav_height);
                Promise.all([pm1, pm2]).then(function (values) {
                    let last_height = values[0].height;
                    if (last_height - sav_height < number_of_confirm) {
                        console.log(ERR_NOT_ENOUGH_CONFIRM)
                        console.log('remain confirm',number_of_confirm + sav_height-last_height)
                        reject(ERR_NOT_ENOUGH_CONFIRM);
                    } else {
                        // console.log('Enough confirm')
                        resolve(values[1]);//resolve block
                    }
                }).catch(function (err) {
                    reject(ERR_GENERAL);
                    console.error(err.message); // some coding error in handling happened
                });
            } else {
                console.log(ERR_NO_SAVE_RESULT_FILE)
                
                reject(ERR_NO_SAVE_RESULT_FILE)
            }
        });
    }
}
module.exports = BTCLotoHelper;