//Choix du style
$(function (){
	$('.color').change(function(){
		var color1 = document.getElementById('color1').value.toString();
		var color2 = document.getElementById('color2').value.toString();
		$('#droppable').css("background" , "linear-gradient(to bottom, #"+color1+", #"+color2+")");
	});
});

//Prévisualisation de la photo
$(function(){
	$('#formulaire input[type="file"]').change(function(){
		if(document.getElementById('droppable').style.display!="none")
		{
			var file = $(this);
			var reader = new FileReader;
			reader.onload = function(event){
				var fileType = file[0].files[0].type;	// Récupération du fichier de base
				var maxW = 225;	// Définition de largeur max après redimensionnement
				var maxH = 225;	// Définition de hauteur max après redimensionnement
				var img = new Image();
				img.onload = function(){
					var origineW = img.width;
					var origineH = img.height;
					var taille = tailleFinale(origineW, origineH, maxW, maxH)	// Utilisation de la fonction de redimensionnement définie en dessous
					var width = taille.width;
					var height = taille.height;
					var canvas = document.createElement('canvas');	//création d'un canvas
					canvas.setAttribute('id', 'canvas_photo');	// Attribue un id au canvas
					canvas.width = width;	// bonne dimension finale en largeur
					canvas.height = height;	// bonne dimension finale en hauteur
					document.getElementById('droppable').style.display="none";	//cache le cadre droppable initial
					$('#photo_thumbnail').after(canvas);	// place le canvas après la legende
					var context = canvas.getContext('2d');
					context.drawImage(img, 0, 0, width, height);	//dessine l'image aux nouvelles dimensions
					data = canvas.toDataURL(fileType);	//converti un canvas en url
					console.log(data);
				};
				img.src = event.target.result;
			};
			reader.readAsDataURL(file[0].files[0]);
		}else{	// Si un canvas a déjà été créé, on va cacher le premier créé et en créé un nouveau
			var file = $(this);
			var reader = new FileReader;
			var canvas = document.getElementById("canvas_photo");
			var context = canvas.getContext("2d");
			context.clearRect(0, 0, canvas.width, canvas.height);
			reader.onload = function(event){
				var fileType = file[0].files[0].type;	// Récupération du fichier de base
				var maxW = 225;	// Définition de largeur max après redimensionnement
				var maxH = 225;	// Définition de hauteur max après redimensionnement
				var img = new Image();
				img.onload = function(){
					var origineW = img.width;
					var origineH = img.height;
					var taille = tailleFinale(origineW, origineH, maxW, maxH)	// Utilisation de la fonction de redimensionnement définie en dessous
					var width = taille.width;
					var height = taille.height;
					canvas.width = width;	// bonne dimension finale en largeur
					canvas.height = height;	// bonne dimension finale en hauteur
					context.drawImage(img, 0, 0, width, height);	//dessine l'image aux nouvelles dimensions
					data = canvas.toDataURL(fileType);	//converti un canvas en url
					console.log(data);
				};
				img.src = event.target.result;
			};
			reader.readAsDataURL(file[0].files[0]);
		};	
	});
});

//Fonction de redimensionnement
var tailleFinale = function(origineW, origineH, maxW, maxH){
	var tailleFinaleW = origineW,
		tailleFinaleH = origineH;
	if(origineW > origineH){
		if(origineW > maxW){
			tailleFinaleH *= maxW / origineW;
			tailleFinaleW = maxW;
		}
	}else{
		if(origineH > maxH){
			tailleFinaleW *= maxH / origineH;
			tailleFinaleH = maxH;
		}
	}
	return{width: tailleFinaleW, height: tailleFinaleH};
}

/*	*************************
	Fonctions de vérification
	*************************	*/

var allIsOk = 1;	//Variable pour vérifier que le formulaire est conforme
var mail_verif = 1;	//Variable de vérification du mail (de base 1 pour refuser l'envoi du formulaire)
var pass_verif = 1;	//Variable de vérification du mot de passe (de base 1 pour refuser l'envoi du formulaire)
var passLength_verif = 1;	//Variable de vérification de la longueur du mdp (de base 1)

//vérification mail
$(function(){
	$('#mail').focusout(function(){
		var mailExplosed = mail.value.split('@')[1];
		if(mailExplosed.search(".ec-lyon.") < 0 && mailExplosed.search(".em-lyon.") < 0){
			document.getElementById('mail_verification').innerHTML = "Cet email n\'est pas valide.";
			//mail_verif++;	//ceci permet d'éviter que le mail soit valide puis modifié
		}else{
			document.getElementById('mail_verification').innerHTML = "";
			mail_verif = 0;	//le test est un succès, on met la variable de vérification à 0
		}
	});
});

//Vérification que le mot de passe soit de longueur suffisante
function verifPassLength(){
	var x = password.value.length;
	var canvas = document.getElementById('passToughnessCanvas');
	var context = canvas.getContext('2d');
	context.clearRect(0, 0, canvas.width, canvas.height);
	var degrade = context.createLinearGradient(0, 0, x*16, x*2);
	if(x <4){
		document.getElementById('password_verification').innerHTML = "Mot de passe trop court.";
		degrade.addColorStop(1, "#c8c8c8");
		degrade.addColorStop(0, "#ff0000");
		passLength_verif++;
	}else if(x >=4 && x <9){
		document.getElementById('password_verification').innerHTML = "Longueur du mot de passe: faible";
		degrade.addColorStop(1, "#c8c8c8");
		degrade.addColorStop(0, "#ffaa00");
		passLength_verif = 0;
	}else if(x >=9 && x <13){
		document.getElementById('password_verification').innerHTML = "Longueur du mot de passe: moyen";
		degrade.addColorStop(1, "#c8c8c8");
		degrade.addColorStop(0, "#26ff8a");
		passLength_verif = 0;
	}else{
		document.getElementById('password_verification').innerHTML = "Longueur du mot de passe: bon";
		degrade = "#26ff8a";
		passLength_verif = 0;
	}
	context.fillStyle = degrade;
	context.fillRect(0, 0, x*18, 300);
};

//vérification mot de passe identique à la confirmation
$(function(){
	$('#confirm_password').blur(function(){
		if(password.value !== confirm_password.value){
			document.getElementById('confirmedPassword_verification').innerHTML = "Le mot de passe n\'est pas identique.";
			pass_verif++;	//ceci permet d'éviter que le password soit valide puis modifié
		}else{
			document.getElementById('confirmedPassword_verification').innerHTML = "";
			pass_verif = 0;	//le test est un succès, on met la variable de vérification à 0
		}
	});
});
/*
//vérification que les champs de données personnelles sont bien remplis
function verifForm(){
	if(mail.value == '' || password.value == '' || confirm_password.value == '' || userLastName.value == '' || userFirstName.value == '' || birthDate.value == '' || country.value == '' || area.value == '' || town.value == '' || phone.value == ''){
		alert('Veuillez remplir toutes les informations personnelles.');
		allIsOk = 1;
	}else if(mail_verif = 1){
		alert('Veuillez vérifier votre mail.');
		allIsOk = 1;
	}else if(pass_verif = 1 || passLength_verif = 1){
		alert('Veuillez vérifier votre mot de passe.');
		allIsOk = 1;
	}else{
		return (allIsOk ==0);	//Retourne true si tous les tests sont ok
	}
};
*/