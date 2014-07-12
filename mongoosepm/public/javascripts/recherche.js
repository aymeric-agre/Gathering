/* $(document).ready(function(){								//Quand la page est chargée
	var strHTMLOutput = '';									//Variables listes <li>projet</li> qui accueillera le HTML final
	$.ajax({'/project/byId/' + projects.id, {					//On appelle le fenêtre ajax '/recherche'
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
							'<a href="/project/' + data[intItem]._id + '">\
								<ul>\
									<li>blablabla</li>\
									<li><%=projects.presentation%></li>\
							</a>'
							);
						}									//On ajoute un lien html avec le nom du projet chaque itération
						strHTMLOutput = "<li>" + arrLI.join('</li><li>') + "</li>";	//On l'intègre dans le html
						}
					}else{									//S'il n'y a pas de projet
						strHTMLOutput = "<li>Vous n'avez de recherche</li>";
						}
						$('#liste').html(strHTMLOutput);//On met la liste dans l'ul #liste
					}
				});
			}); */

/*	THEMES	*/						
function showDetails(theme) {
	played = $(".play").closest("ul").attr("id");
	$("input[value="+played+"]").css('background', 'linear-gradient(to bottom, rgba(8,120,120,0.8), rgba(3,60,60,0.8))')	//on remet la couleur normale
		.attr('name', '');	//on retire le name
	$(".play").removeClass("play")		//On enlève la classe à ceux qui l'avaient
		.css('background', 'linear-gradient(to bottom, rgba(8,120,120,0.8), rgba(3,60,60,0.8))');
	$(theme).css('background','linear-gradient(to bottom, rgba(120,8,8,0.6), rgba(60,3,3,0.8))')	//On identifie la classe sélectionnée par une couleur
		.attr('name', 'selectedTheme');	//on ajoute le name
	var category = $(theme).attr("value");	//On récupère son nom
	$("#"+category+" li").each(function (i) {			//On fait apparaitre les li les uns après les autres
        $(this).attr("style", "-webkit-animation-delay:" + i * 100 + "ms;"
                + "-moz-animation-delay:" + i * 100 + "ms;"
                + "-o-animation-delay:" + i * 100 + "ms;"
                + "animation-delay:" + i * 100 + "ms;");
        if (i == $("#"+category+" li").size() -1) {
			$("#"+category).addClass("play")		//On ajoute la classe "play"	
        }
    });
}

/*	CATEGORY */
function selectCategory(theme) {
	if($(theme).attr("class")=="button play"){	//S'il était déjà selectionné
		$(theme).css('background', 'linear-gradient(to bottom, rgba(8,120,120,0.8), rgba(3,60,60,0.8))')	//on remet la couleur normale
			.removeClass("play")	//On retire sa classe
			.attr('name', '');	//on r²etire le name
	} else {
		$(theme).css('background','linear-gradient(to bottom, rgba(120,8,8,0.6), rgba(60,3,3,0.8))')	//On identifie la classe sélectionnée par une couleur
			.addClass("play")	//On ajoute la class play
			.attr('name', 'selectedCategory');	//on ajoute le name
	}
}
	
/*	RESULTATS	*/
$(document).ready(function(){
	$(".button").click(function(){	//détection du clic -> modifier le nom de l'id
		$field = $(this);
		$("#results").html('');	//on vide les resultats
		$("#ajax-loader").remove();	//on retire le loader
		$.ajax({
			type: 'POST',	//méthode d'envoi
			url: 'doSearchProjectByCategory',	//url du fichier de traitement
			data: 'data='+$('input[name="selectedTheme"]').val()+$('input[name="selectedCategory"]').val(),	//données à envoyer
			beforeSend: function(){	//traitement à faire avant l'envoi
				//$field.after('<img src="blabla.gif" alt="loader" id="ajax-loader">');	//ajout d'une image indiquant le chargement
			},
			success: function(data){	//traitement JS à faire après l'envoi
				$("#ajax-loader").remove();	//On enlève le loader
				$("#results").html(data);	//affichage des résultats dans le bloc
			}
		});
	});
});