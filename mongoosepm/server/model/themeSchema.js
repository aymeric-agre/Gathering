var mongooseTheme = require('mongoose');

var Schema = mongooseTheme.Schema;

var themeSchema = new Schema({
	theme: {type: String, unique: true}
});

exports.Theme = mongooseTheme.model('Theme', themeSchema);