let co = require('co');
function*ss(){
	yield sss();
	function*sss(){
		console.log('haha');
	}
}
co(ss());