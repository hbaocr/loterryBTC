const GoogleSpreadsheet = require('google-spreadsheet');
class GoogleSheetHelper {
    constructor(spreadSheetID, credjson_path) {
        this.creds = require(credjson_path);
        this.sheetHdl = new GoogleSpreadsheet(spreadSheetID);
    }
    parse_rows(rows){
        let sz = rows.length;
        var res = [];// empty Object
        for(let i=0;i<sz;i++){
            var data ={
                timestamp  : rows[i].timestamp,
                btcaddress : rows[i].btcaddress
            }
            res.push(data);
        }
       return JSON.stringify(res);
    }
    getRecordsbyTimeStamp(col_name,max_recs, is_dec,row_ofset=1) {
        var doc = this.sheetHdl;
        var creds = this.creds;
        var parse_rows = this.parse_rows;
        return new Promise(function (resolve, reject) {

            // Authenticate with the Google Spreadsheets API.
            doc.useServiceAccountAuth(creds, function (err) {
                if (err) {
                    console.error(err);
                    reject(err);
                    return;
                }
                // Get all of the rows from the spreadsheet.
                let options = {};
                if (is_dec == 1) {
                    options = {
                        offset: row_ofset,
                        limit: max_recs,
                        orderby: col_name,
                        reverse: true
                    }
                } else {
                    options = {
                        offset: row_ofset,
                        limit: max_recs,
                        orderby: col_name,
                    }
                }
                var sheetOrder=1;//first sheet in spreadSheet
                doc.getRows(sheetOrder, options, function (err, rows) {
                    if (err) {
                        reject(err);
                        console.error(err);
                    } else {
                      //  console.log(rows);
                      let json=parse_rows(rows)
                      resolve(json);

                    }
                });
            });


        });
    }
}

module.exports = GoogleSheetHelper;
