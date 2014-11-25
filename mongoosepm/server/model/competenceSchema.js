var mongooseCompetence = require('mongoose');

var Schema = mongooseCompetence.Schema;

var CompetenceSchema = new Schema({
	competence: {type: String, unique: true},
	user: [{type: mongooseCompetence.Schema.Types.ObjectId, ref: 'User'}],
	project: [{type: mongooseCompetence.Schema.Types.ObjectId, ref: 'Project'}],
	group: [{type: mongooseCompetence.Schema.Types.ObjectId, ref: 'Group'}]
});

exports.Competence = mongooseCompetence.model('Competence', CompetenceSchema);