/*	**************
	barre d'outils
	**************	*/
	
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
	var liens = ['presentation', 'forum', 'diagramme', 'agenda', 'dropdoc', 'dispo', 'discussion','diaporama'];
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

/*	*********************
	Créer un mode travail 
	*********************	*/
	
$("#work").click(function() {
	if($("section").hasClass("selected")){		//Passage en mode lecture
		$("section").removeClass("selected"),
		stopTiny(),							//On ferme les éditeurs TinyMCE
		$("article").animate({
			width:'572'
			}, 800, "linear"),
		$("section").animate({
			width:'920px',
			}, 1000, "swing"),		
		$("#work").css({
			background:'green'
			}, 1000, "swing"),
		$("nav").fadeIn(1000),
		$(".case").delay(800).fadeIn(1000);
	}
	else {									//Passage en mode édition
		$("nav").fadeOut(800),
		$(".case").fadeOut(500),
		$("section").animate({
			width:'1200px',
			}, 1000, "swing"),
		$("#work").css({
			background : 'red'
			}, 1000, "swing"),
		$("article").delay(300).animate({
			width:'920'
			}, 1000, "swing"),
		$("section").addClass("selected"),
		firesTiny();						//On ouvre les éditeurs TinyMCE
	}
});


/*	********
	sortable 
	********	*/
	
$(function() {
$( "#sortable" ).sortable();
$( "#sortable" ).disableSelection();
});

/*	*********
	Diaporama 
	*********	*/

$(".bouton[value=diaporama]").click(function() {
		$("#start").fadeIn(1000);
});

$(".bouton[value!=diaporama]").click(function() {
		$("#diapo").fadeOut(100);
});

$("#start").click(function() {
	$(this).fadeOut(500, function (){
		$("#diapo").fadeIn(1000);
	}); 	
});

/*	**************
	ouvrir Tinymce
	**************	*/
function firesTiny(){

	/*Récupérer le contenu*/
	$(".contenu").each(function(){							//Pour chaque éléments de la classe .contenu
		var id_explosed = $(this).attr('id').split('-');	//l'id des .annuler est séparée dans un tableau selon les "-"
		var id_annonce = id_explosed[1];					//On récupère la deuxième partie de l'id
		var contenu_annonce = $(this).html();				//Contenu HTML de .contenu sur lequel on clique
		$('#textarea-'+id_annonce).html(contenu_annonce);	//Remplace le contenu de textarea par celui de .contenu
		$('#contenu-'+id_annonce).fadeOut(800);				//Cache le #contenu
		$('#form-'+id_annonce).fadeIn(800);					//Montre le form en question
	});	
		
	tinymce.init({
		selector: 'textarea',
		theme: "modern",
		width: 900,
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
} 

/*	*******************
	Soumettre l'édition
	*******************	*/

function stopTiny(){	
	$('.form').each(function(){
			var name_explosed = $(this).attr('id').split('-');	
			var id_annonce = name_explosed[1];
			var contenu = tinyMCE.get('textarea-'+id_annonce).getContent();		//il faut mettre le "name" du textarea et pas son id !
			$("#contenu-"+id_annonce).html(contenu);		//On injecte le conenu dans la page
			$("#form-"+id_annonce).fadeOut(1000);
			$("#contenu-"+id_annonce).fadeIn(1000);
	});
}

/*	*****
	Gantt
	*****	*/
