/*	*************
	LISTE PROJETS
	*************	*/

/*	AJAX affiche la liste de projets	*/
//Remarque : on a défini la variable userID dans la page HTML avec EJS
$(document).ready(function(){								//Quand la page est chargée
	var strHTMLOutput = '';									//Variables listes <li>projet</li> qui accueillera le HTML final
	$.ajax('/project/byuser/' + userID, {					//On appelle le fenêtre ajax '/projet/byuser/' avec userID à la fin pour la fonction export
		dataType : 'json',									//On défini le type comme json
		error: function() {									//En cas d'erreur  ajax
			console.log("ajax error : (");
		},
		success : function (data) {							//En cas de succès
			if(data.length > 0){							//S'il y a une donnée (>0)
				if(data.status && data.status ==='error'){	//S'il y a une erreur dans le status json on l'affiche avec HTML
					strHTMLOutput = "<li>Error : " + data.error + "</li>";
				}else{
					var intItem,
						totalItems = data.length,			//longueur de la donnée (nombre de projets?)
						arrLI = [];							//tableau qui contiendra les projets
					for(intItem = totalItems - 1; intItem >=0; intItem--) {
						arrLI.push(
							'<a href="/project/' + data[intItem]._id + '"> <img src="/public/images/nodejs.jpg" alt="node"></a>'
							);
						}									//On ajoute un lien html avec le nom du projet et un image de base à chaque itération
						strHTMLOutput = "<li>" + arrLI.join('</li><li>') + "</li>";	//On l'intègre dans le html
						}
					}else{									//S'il n'y a pas de projet
						strHTMLOutput = "<li>Vous n'avez pas encore créé de projets</li>";
						}
						$('#liste').html(strHTMLOutput);//On met la liste dans l'ul #liste
					}
				});
			});
			
		
/*	effet d'entrée	*/	
$(document).ready(function () {
    $("ul[data-liffect] li").each(function (i) {
        $(this).attr("style", "-webkit-animation-delay:" + i * 100 + "ms;"
                + "-moz-animation-delay:" + i * 100 + "ms;"
                + "-o-animation-delay:" + i * 100 + "ms;"
                + "animation-delay:" + i * 100 + "ms;");
        if (i == $("ul[data-liffect] li").size() -1) {
            $("ul[data-liffect]").addClass("play")
        }
    });
});


/*	****************
	CREATION PROJETS
	****************	*/

/*	MODIFIER LA PAGE : LISTE/FORMULAIRE	*/
/*	Mettre le formulaire	*/
$("#creation").click(function() {
	$("#liste_projets").fadeOut(500),
	$("#creation_projet").delay(500).fadeIn(1000),
	$("section").addClass("selected"),
	firesTiny();						//On ouvre les éditeurs TinyMCE
});

/*	 Sortir du formulaire sans enregistrer	*/
$("#annuler").click(function() {
		$("section").removeClass("selected"),
		//clearTiny(),							//On ferme les éditeurs TinyMCE	et on enregistre rien
		$("#creation_projet").fadeOut(500),
		$("#liste_projets").delay(500).fadeIn(1000);
});

/*	Bouton pour ajouter un input	*/
$(".new").click(function() {
	var name_explosed = $(this).attr('id').split('-');	
	var id_annonce = name_explosed[1];
	$('<input></input>').insertAfter('#output-'+id_annonce).addClass("input-"+id_annonce).addClass("input");	//La deuxième classe est pour le style
});

/*	Soumettre un formulaire	*/
$("#Submit").click(function() {
	$('.edit').each(function(){
		var name_explosed = $(this).attr('id').split('-');	
		var id_annonce = name_explosed[1];
		var contenu = tinyMCE.get('edit-'+id_annonce).getContent({format : 'text'});		//il faut mettre le "name" du edit et pas son id !
		$("#input-"+id_annonce).val(contenu);											//On injecte le contenu dans les inputs invisibles
	});
	$('.output').each(function(){
		var name_explosed = $(this).attr('id').split('-');
		var id_annonce = name_explosed[1];
		var y=[];		//on crée un array vide qui contiendra les utilisateurs, ...
		$(".input-"+id_annonce).each(function(){	//pour chaque input (remarque : c'est important que ce soit une classe pour en mettre plusieurs
			var x=$(this).val();		//on récupère sa valeur
			y.push(x);				//on l'ajoute au tableau
		});		
		$(this).val(y);					//on met le tableau sous forme string dans notre output (on le sépare après)
	});
		
	$("#formulaire").delay(500).submit();		//On soumet le formulaire après avoir mis les informations dans des inputs invisibles.
});
								
								
/*	BARRE D'OUTILS	*/
var fixed = false;		//variable détermine si le menue onglet est fixe ou flottant
 
 /*Fonction appeler lors du scroll*/  
$(document).scroll(function() {	
    if( $(this).scrollTop() > 110 ) {				// Se lance à partir de 115px de défilement
		if( !fixed ) {								// S'il est pas fixe on le rend fixe	
		fixed = true;
		$('#menu').css({position:'fixed', top:70});
		}
	} else {
		if( fixed ) {
		fixed = false;
		$('#menu').css({position:'relative', top:0}, 500);	//se remet bien au retour
		}
	}
});

/*Fait défiler une page jusqu'à l'onglet quand on clique dessus*/
function afficher(elem, id) {
	var liens = ['presentation', 'toolstore'];
	for (lien in liens) {
		$("#"+liens[lien]).hide();	//On les cache tous puis parce qu'on ne sait pas lequel est affiché en ce moment	
		$(".bouton[value="+liens[lien]+"]").removeClass('active');
	}
		
	$("#"+id).show();			//On affiche la page demandée
	$(".bouton[value="+id+"]").addClass('active');
	
	jQuery('html,body').animate({scrollTop:0},500,'swing',function(){	//anime le scrolltop pour le mettre en haut en 1000ms avec un effet swing
				window.location.hash = '#';
			});	
}

/*	EDITION DE TEXTE	*/

/*	lancer tinyMCE	*/
function firesTiny(){
	$(".contenu").each(function(){							//Pour chaque éléments de la classe .contenu
		var id_explosed = $(this).attr('id').split('-');	//l'id des .annuler est séparée dans un tableau selon les "-"
		var id_annonce = id_explosed[1];					//On récupère la deuxième partie de l'id
		var contenu_annonce = $(this).html();				//Contenu HTML de .contenu sur lequel on clique
		$('#textarea-'+id_annonce).html(contenu_annonce)	//Remplace le contenu de textarea par celui de .contenu
		$('#contenu-'+id_annonce).fadeOut(800);				//Cache le #contenu
		$('#form-'+id_annonce).fadeIn(800);					//Montre le form en question
	});	
		
	tinymce.init({
		selector: 'textarea',
		theme: "modern",
		width: 560,
		height: 300,
		plugins: [
			 "advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker",
			 "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
			 "save table contextmenu directionality emoticons template paste textcolor",
	   ],
	   toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media fullpage | forecolor backcolor emoticons", 
	   style_formats: [
			{title: 'Bold text', inline: 'b'},
			{title: 'Red text', inline: 'span', styles: {color: '#ff0000'}},
			{title: 'Red header', block: 'h1', styles: {color: '#ff0000'}},
			{title: 'Example 1', inline: 'span', classes: 'example1'},
			{title: 'Example 2', inline: 'span', classes: 'example2'},
			{title: 'Table styles'},
			{title: 'Table row 1', selector: 'tr', classes: 'tablerow1'}
		]
	}); 

	tinymce.init({
    selector: "div.edit",
    theme: "modern",
    add_unload_trigger: false,
    schema: "html5",
    inline: true,
    toolbar: false,
    statusbar: false
});

}

/*	Annuler TinyMCE	*/

