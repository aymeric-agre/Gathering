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

//vérification mail
$(function(){
	$('#mail').focusout(function(){
		if(mail.value.search(".ec-lyon.") != -1){
			alert('cet email est correct');
		}else{
			alert('email non correct');
		}
	});
});
	
/*
var fieldalias="mot de passe"
function verifier_pass(confirm_pass, pass){
	if(pass.value=''){
		alert("Veuillez entrer votre " + fieldalias + " dans le premier champ!")
		pass.focus()
	}
	else if(confirm_pass.value==''){
		alert("Veuillez confirmer votre "+ fieldalias + " dans le second champ!")
		confirm_pass.focus()
	}
	else if
*/
/*
function verifier_pass(confirm_pass,pass)
{	
	console.log(confirm_pass + pass);
	//Par exemple, si tu veux que le pseudo ait entre 4 et 25 caractères
	if(confirm_pass.value!=pass.value){
	confirm_pass.style.backgroundColor = 'red';
	}else{
	confirm_pass.style.backgroudColor = 'none';
	}
}
*/
