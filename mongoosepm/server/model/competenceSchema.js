var mongooseCompetence = require('mongoose');

var Schema = mongooseCompetence.Schema;

var CompetenceSchema = new Schema({
	competence: {type: string, unique: true},
	user: [{type: mongooseCompetence.Schema.Types.ObjectId, ref: 'User'}]
});

exports.Competence = mongooseCompetence.model('Competence', CompetenceSchema);