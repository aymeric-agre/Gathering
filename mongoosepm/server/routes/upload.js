//Fichier pour gérer tous les types d'upload

exports.uploadFileGet = function(req,res,done){	// fonction de traitement du formulaire d'inscription
	console.log('yo');
	console.log('voici flowChunkNumber : ' + req.query.flowChunkNumber);
	console.log('voici flowChunkSize : ' + req.query.flowChunkSize);
	console.log('voici flowCurrentChunkSize : ' + req.query.flowCurrentChunkSize);
	console.log('voici flowTotalSize : ' + req.query.flowTotalSize);
	console.log('voici flowIdentifier : ' + req.query.flowIdentifier);
	console.log('voici flowFilename : ' + req.query.flowFilename);
	console.log('voici flowRelativePath : ' + req.query.flowRelativePath);
	console.log('voici flowTotalChunks : ' + req.query.flowTotalChunks);
	console.log('voici body : ');
	console.log(req.body);
	console.log('voici files : ');
	console.log(req.files);
	console.log('voici req.method : ' + req.method);
	res.end();
};

exports.uploadFilePost = function(req,res,done){	// fonction de traitement du formulaire d'inscription
	console.log('yo');
	console.log('voici body : ');
	console.log(req.body);
	console.log('voici files : ');
	console.log(req.files);
	console.log('voici req.method : ' + req.method);
	body=req.body;
	files=req.files;		
	return res.json(files);
};


