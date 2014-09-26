	var x=90;
	var y=150;
	var rect = document.getElementById("mon_canvas_2");
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
	ctx.lineTo(230,10);   
	ctx.lineTo(230,30);   
	ctx.lineTo(10,30); 	
	ctx.lineTo(10,10);
	ctx.closePath();      // Fermeture du chemin (facultative)
	ctx.strokeStyle='black';
	ctx.stroke();
	ctx.fill();
	//------------------------------------------
	//flèche extérieure
	/*ctx.beginPath();
	ctx.moveTo(10,10);   
	ctx.lineTo(200,10);  
	ctx.lineTo(200,0);
	ctx.lineTo(230,20);
	ctx.lineTo(200,40);
	ctx.lineTo(200,30);   
	ctx.lineTo(10,30); 	
	ctx.lineTo(10,10);
	ctx.closePath();      // Fermeture du chemin (facultative)
	ctx.stroke();*/
	//--------------------------------------
	//curseur1
	ctx.beginPath();
	ctx.moveTo(x, 32);
	ctx.lineTo(x+8, 40);
	ctx.lineTo(x-8, 40);
	ctx.closePath();
	ctx.fillStyle = 'black';
	ctx.fill();
	ctx.fillText("Min", x-8, 50);
	
	//curseur2
	ctx.beginPath();
	ctx.moveTo(y,32);
	ctx.lineTo(y+8, 40);
	ctx.lineTo(y-8, 40);
	ctx.closePath();
	ctx.fill();
	ctx.fillText("Max", y-8, 50);
