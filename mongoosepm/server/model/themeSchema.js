var mongooseTheme = require('mongoose');

var Schema = mongooseTheme.Schema;

var themeSchema = new Schema({
	theme:{
		name: {type: String, unique: true},
		subTheme : {[type: String, unique: true]}
	}
});

exports.Theme = mongooseTheme.model('Theme', themeSchema);