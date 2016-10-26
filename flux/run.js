var w = {};

try {
	if(window) w = window;
} catch(err) {}

w.React = require('react');
w.ReactDOM = require('react-dom');
w.Index = require('./index.react');