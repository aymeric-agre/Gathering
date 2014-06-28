$(document).ready(function(){								//Quand la page est chargée
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
			});