var mongooseLanguage = require('mongoose');

var Schema = mongooseLanguage.Schema;

var LanguageSchema = new Schema({
	Language: {type: string, unique: true},
	user: [{type: mongooseLanguage.Schema.Types.ObjectId, ref: 'User'}]
});

exports.Language = mongooseLanguage.model('Language', LanguageSchema);