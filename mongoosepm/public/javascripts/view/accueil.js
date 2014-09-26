/*
$("li").hover(function(){
	$(".text", this).stop( true, true ).animate({
		top:'-=120px',	// On monte le haut de la case de 120px 
		opacity:'0.8',
		height:'+=120px',	// On augment la taille de la case de 120px 
	}, "slow");
	$(".text p", this).stop( true, true ).css({
        display:'block',
    }, "swing")
},function(){
	$(".text", this).stop( true, true ).animate({
		top:'+=120px',
		opacity:'1',
		height:'-=120px',
	}, "slow");
	$(".text p", this).stop( true, true ).css({
        display:'none',
    }, "swing")
});
*/
//Choix du style -> Ne fonctionne pas, surement à cause du template
function updateGradient() {
	$('.gradient').css("background" , "linear-gradient(to bottom, #"+color1+", #"+color2+")");
}