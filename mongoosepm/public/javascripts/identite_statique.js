/*	*******
	Édition
	*******	*/
	
$("#editer").click(function() {
	if($("section").hasClass("selected")){		//Passage en mode lecture
			stopSortable(),
		$("section").removeClass("selected"),
		$("article").animate({
			width:'572'
			}, 800, "linear"),
		$("section").animate({
			width:'920px',
			}, 1000, "swing"),		
		$("#editer").css({
			background:'linear-gradient(to bottom, rgba(8,120,120,0.8), rgba(3,60,60,0.8))'
			}, 1000, "swing"),
			$("nav").fadeIn(1000);
	}
	else {									//Passage en mode édition
		$("nav").fadeOut(800),
		$("section").animate({
			width:'1200px',
			}, 1000, "swing"),
		$("#editer").css({
			background : 'linear-gradient(to bottom, rgba(120,8,8,0.6), rgba(60,3,3,0.8))'
			}, 1000, "swing"),
		$("article").delay(300).animate({
			width:'920'
			}, 1000, "swing"),
		$("section").addClass("selected"),
			startSortable();
	}
});

/*	************
	Dragg'n'Drop
	************	*/

function startSortable() {
	$( "article" ).sortable(),
	$( "#photo" ).droppable({accept : '.image'}),
	$( "article" ).sortable('enable'),
	$( "#photo" ).css({border:"dashed",opacity:"0.5"},1000,"swing"),
	$( "#photo" ).droppable('enable');
};

function stopSortable() {
	$( "#photo" ).css({border:"none",opacity:"1"},1000,"swing"),
	$( "article" ).sortable('disable'),
	$( "#photo" ).droppable('enable');	
};