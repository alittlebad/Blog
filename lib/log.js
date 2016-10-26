var log4js = require('log4js');
log4js.configure({
    appenders:[
        {
            type:'console',
            category:'console'
        },
        {
            type:'file',
            filename:'./log/log.log',
            maxLogSize: 1024*1024,
            backups:50,
            category:'normal',
        }
    ],
    replaceConsole:true,
    levels:{
        dateFileLog:'INFO'
    }
});
var dateFileLog = log4js.getLogger('info');

exports.logger = dateFileLog;
exports.use = function(app){
    app.use(log4js.connectLogger(dateFileLog, {level:'info',format:':method :url'}));
}