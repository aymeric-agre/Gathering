var mongooseTheme = require('mongoose');

var Schema = mongooseTheme.Schema;

var themeSchema = new Schema({
	theme: {type: String, unique: true},
	user: [{type: mongooseTheme.Schema.Types.ObjectId, ref: 'User'}],
	project: [{type: mongooseTheme.Schema.Types.ObjectId, ref: 'Project'}],
	group: [{type: mongooseTheme.Schema.Types.ObjectId, ref: 'Group'}]
});

exports.Theme = mongooseTheme.model('Theme', themeSchema);