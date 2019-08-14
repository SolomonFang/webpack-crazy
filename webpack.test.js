'use strict';

const path = require('path');

module.exports = {
	mode: 'production',
	entry: {
		app: './src/app/index.js',
		search: './src/search/index.js' 
	},
	output: {
		path: path.resove(___dirname, 'dist'),
		filename: '[name].js'
	}
}	
