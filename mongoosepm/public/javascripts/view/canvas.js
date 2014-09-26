	var x=190;
	var rect = document.getElementById("mon_canvas");
	var ctx = rect.getContext("2d");
	//-----------------------------------------
	//gestion du dégradé
	var lineGrad=ctx.createLinearGradient(10,25,200,25);
	lineGrad.addColorStop(0,'rgba(0,128,0,0.2)');
	lineGrad.addColorStop(1,'green');
	//------------------------------------------
	//remplissage
	ctx.beginPath();
	ctx.fillStyle=lineGrad;
	ctx.moveTo(10,10);    // Le tracé part du point 50,50
	ctx.lineTo(x,10);   
	ctx.lineTo(x,30);   
	ctx.lineTo(10,30); 	
	ctx.lineTo(10,10);
	ctx.closePath();      // Fermeture du chemin (facultative)
	ctx.strokeStyle='black';
	ctx.fill();
	//------------------------------------------
	//flèche extérieure
	ctx.beginPath();
	ctx.moveTo(10,10);   
	ctx.lineTo(200,10);  
	ctx.lineTo(200,0);
	ctx.lineTo(230,20);
	ctx.lineTo(200,40);
	ctx.lineTo(200,30);   
	ctx.lineTo(10,30); 	
	ctx.lineTo(10,10);
	ctx.closePath();      // Fermeture du chemin (facultative)
	ctx.stroke();
	//--------------------------------------
	//curseur
	ctx.beginPath();
	ctx.moveTo(x,42);
	ctx.lineTo(x+8, 50);
	ctx.lineTo(x-8, 50);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle='black';
	ctx.fillText("Avancement", x-28, 60);
