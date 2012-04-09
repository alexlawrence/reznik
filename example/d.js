// this will only work when reznik is executed with PhantomJS
var div = document.createElement('div');
var href = window.location.href;

require.config({
	paths: {
		'named/d': 'd'
	}
});

if (define.amd) {
    define('named/d', function() {

    });
}

