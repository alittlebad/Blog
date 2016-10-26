
module.exports = function*(){
    var d = this.xfields;
    //var c = JSON.parse(d);
    console.log(JSON.stringify(d));
    return new this.U.JsonOk({
		'post': 'success',
	});
}