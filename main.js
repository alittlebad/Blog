'use strict';
let koa = require('koa');
let koaBody = require('koa-body');
let staticCache = require('koa-static-cache');
let gzip = require('koa-gzip');
let path = require('path');
let ejs = require('ejs');
let fs = require('fs');
let objectAssign = require('object-assign');
let log = require('./lib/log.js');
let app = koa();

app.use(gzip());

app.use(staticCache(path.join(__dirname, 'static'), {
		'gzip': true
}));
app.use(koaBody({formidable:{uploadDir: '/tmp'}, multipart: true}));

app.use(function *loggerAsync(next) {
	let now = new Date();
	this.orig_path = this.path;
	this.orig_query = objectAssign({}, this.query);

	try {
		yield next;
	} catch(err) {
		log.logger.error(err.message, err.stack);
	} finally {
		let delta = new Date() - now;
		delta = (delta / 1000).toFixed(2);
		let logObj = {
			'cost': delta,
			'req': {
				'method': this.method,
				'host': this.host,
				'path': this.path,
				'orig_path': this.orig_path,
				'query': this.query,
				'orig_query': this.orig_query,
				'search': this.search,
				'body': this.request.body,
				'agent': this.request.get('user-agent'),
				'accept-encoding': this.request.get('accept-encoding'),
				'ip': this.ip,
				'ips': this.ips,
				'x-real-ip': this.request.get('x-real-ip'),
				'sid': this.cookies.get('www_sid')||'',
				'user': this.xuser?this.xuser.user_id:'not_login',
				'referer': this.request.get('referer'),
			},
			'res': {
				'status': this.status,
				'length': this.length
			}
		};

		log.logger.info(JSON.stringify(logObj));
		//console.log(JSON.stringify(logObj));
	}
});

app.use(function *initHelpersAsync(next) {
	this.U = require('./util');
	this.xfields = objectAssign(
						{}, 
						this.request.body.fields||this.request.body
						);
	yield next;
});

app.use(function*routeAsync(next){
    let path = this.path;
    if(/\.\./.test(path)) {
		path = '/';
	}
	if(!/^(\/[\/a-z\d\-\_\.]+)+$/.test(path)) {
		path = '/';
	}

    if(path == '/') path = '/index';
	let actionFn = './action' + path + '.js';
	if(!fs.existsSync(actionFn)) {
		yield next;
		return;
	}
	
    let ret = null;
	let data = null;
	let action = require(actionFn);
	ret = yield (action.bind(this))(next);

	if(ret instanceof this.U.JsonError) {
		data = {
			'success': false,
			'error': ret.msg
		}
	} else if(ret instanceof this.U.JsonOk) {
		data = {
			'success': true,
			'data': ret.data
		}
	} else if(ret instanceof this.U.TmplNone) {
		data = undefined;
	} else {
		if(ret instanceof this.U.TmplError) {
			ret = new this.U.TmplResult('error', {
				'msg': ret.msg
			});
		}

		if(ret instanceof this.U.TmplResult) {
			let fn = './templates/' + ret.name + '.ejs';
			fn = fn.toLocaleLowerCase();

			if(!fs.existsSync(fn)){
				this.throw(404);
				return;
			}
			data = ejs.render(
				fs.readFileSync(fn).toString(),
				{
					'compname':ret.name,
					'data':ret,
					'opt': {},
				},
				{
					'filename':fn
				});
		}
	}

	if(typeof(data) == 'object') {
		data = JSON.stringify(data, null, 2);
		this.set('Content-Type', 'application/json');
	}
	
	if(data !== undefined) {
		this.body = data;
	}
});
app.listen(10000)
log.logger.info('Listen on port: 10000');
