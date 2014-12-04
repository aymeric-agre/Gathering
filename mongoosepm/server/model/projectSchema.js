var mongooseProject = require('mongoose');	// initialisation de mongoose

/*	******
	SCHEMA
	******	*/

var Schema = mongooseProject.Schema;

var projectSchema = new Schema({		// création du modèle -> structure des données
	private: {

	},
	public: {
			//Membres du groupe
		projectName: {type: String, unique: true, required: true},
		createdBy: {
            user: {type: mongooseProject.Schema.Types.ObjectId, ref: 'User'},
            date: { type: Date, default: Date.now }
        },
		projectManager : [{type: mongooseProject.Schema.Types.ObjectId, ref: 'User'}],
		members:{ 	admin: [{type: mongooseProject.Schema.Types.ObjectId, ref: 'User'}],
					worker : [{type: mongooseProject.Schema.Types.ObjectId, ref: 'User'}],
					guest : [{type: mongooseProject.Schema.Types.ObjectId, ref: 'User'}]
				},
		group: [{type: mongooseProject.Schema.Types.ObjectId, ref: 'Group'}],
		whoCanRW: { type: String, enum: ['admin', 'worker', 'guest', 'everyOne'], default: 'worker' },	//Qui peut réécrire. Problème : c'est pour tout le projet
		
			//Organisation dans le temps
		StartDate: {type : Date},
        EndDate: {type : Date},			//Si la date de fin est sûre
		TargetEndDate: {type : Date},	//Si la date de fin est incertaine
		sequence: { type: Number, default: 0 },	//Projet découpé en séquences
		estimated: { type: Number, default: 0 },
        logged: { type: Number, default: 0 },
        remaining: { type: Number, default: 0 },
        progress: { type: Number, default: 0 },
		
			//Contenu
		projectType: {type: mongooseProject.Schema.Types.ObjectId, ref: 'ProjectType', default: '' },	//Schéma défini en dessous
		description : {type : String},
		task: [{ type: ObjectId, ref: 'Tasks', default: null }],	//Schéma défini en dessous
		competence: [{type: mongooseProject.Schema.Types.ObjectId, ref: 'Competence'}],
		themes: [{type: mongooseProject.Schema.Types.ObjectId, ref: 'Theme'}],
		editedBy: {
            user: {type: mongooseProject.Schema.Types.ObjectId, ref: 'User'},
            date: { type: Date }
        }
	}
});

//Schéma des tâches
var taskSchema = new Schema({
    summary: { type: String, default: '' },
    taskCount: { type: Number, default: 0 },
    project: { type: mongooseProject.Schema.Types.ObjectId, ref: 'Project', default: null },
    assignedTo: [{type: mongooseProject.Schema.Types.ObjectId, ref: 'User'}],
    tags: [{type : String}],
    description: {type : String},
    priority: { type: String, default: 'P3' },
    sequence: { type: Number, default: 0 },
    StartDate: { type: Date, default: Date.now },
    EndDate: { type: Date, default: Date.now },
    duration: { type: Number, default: 0 },
    type: { type: String, default: '' },
    estimated: { type: Number, default: 0 },
    logged: { type: Number, default: 0 },
    remaining: { type: Number, default: 0 },
    progress: { type: Number, default: 0 },
    createdBy: {
        user: { type: ObjectId, ref: 'Users', default: null },
        date: { type: Date, default: Date.now }
    },
    editedBy: {
        user: { type: ObjectId, ref: 'Users', default: null },
        date: { type: Date }
    }
});

//Schéma des types de projets
var projectTypeSchema = mongoose.Schema({
	name: {type : String}
});

/*	********
	METHODES
	********	*/
	
//Remarque : les méthodes doivent être définies après les schémas et avant les modèles

projectSchema.statics.findByUserID = function (userid, callback) {
	this.find(					//On cherche un projet
		{ createdBy : userid },	//Dont le créateur est userid
		'_id projectName',		//On récupère un tableau d'instance de projets avec _id et nom du projet
		{sort: 'modifiedOn'},	//On les tri par date de modification
		callback);
};

projectSchema.statics.findByName = function (tag, callback) {
	this.find({ projectName : tag },{sort: 'modifiedOn'}, callback);
};

projectSchema.statics.findByProjectID = function (projectId, callback) {
	this.find(					//On cherche un projet
		{ _id : projectId },	//Dont le créateur est userid
		'_id projectName',		//On récupère un tableau d'instance de projets avec _id et nom du projet
		{sort: 'modifiedOn'},	//On les tri par date de modification
		callback);
};


exports.ProjectType = mongooseProject.model('ProjectType', projectTypeSchema);
exports.Tasks = mongooseProject.model('Tasks', taskSchema);
exports.Project = mongooseProject.model('Project', projectSchema);	// exportation du modèle pour pouvoir l'utiliser
