window.onload = function ()
			{
				var gantt = new RGraph.Gantt('cvs', [
													  [0, 180, 100, 'HTML/CSS','white','red','red'],[60, 200-60, 100, 'Javascript','white','red','red'],[74, 250-74, 100, 'JQuery','white','red','red'],
													  [100, 260-100, 95, 'Node','white','red','red'],[140, 260-140, 95, 'MongoDB/Mongoose','white','red','red'],[140, 260-140, 95, 'Express','white','red','red'],
													  [140, 260-140, 100, 'EJS','white','red','red'],[140, 260-140, 100, 'Canvas','white','red','red'],
													  [120,200-120,100,'Templates','white','yellow','yellow'],[140,235-140,100,'Base de données','white','yellow','yellow'],[120,240-120,100,'Layouts','white','yellow','yellow'],
													  [0,140-0,100,'Projet','white','green','green'],[60,240-60,100,'Identité','white','green','green'],[80,180-80,100,'Accueil','white','green','green'],[100,240-100,95,'Recherche','white','green','green'],
														[180,250-180,80,'Gantt','white','blue','blue'],[140,250-140,100,'Edition WYSIWYG','white','blue','blue'],
													  [210,260-210,100,'Diaporama','white','blue','blue'],[140,180-140,60,'Barre d"avancement','white','blue','blue'],[230,260-230,100,'JSColor','white','blue','blue'],[230,260-230,100,'JQuery UI','white','blue','blue'],
													  [230,260-230,0,'framacalc','white','blue','blue'],[230,260-230,0,'framapad','white','blue','blue'],[230,260-230,0,'framadate','white','blue','blue'],
													  [50,65-50,100,'Préparation RVP1','white','grey','grey'],[65,1,null,'RVP1','grey','grey','grey'],[200,215-200,100,'Préparation RVP2','grey','grey','grey'],[215,1,null,'RVP2','grey','grey','grey'],
													  [240,270-240,70,'Préparation soutenance','white','grey','grey'],[269,1,null,'Soutenance','grey','grey','grey']
													 ])
					.Set('vbars', [[255, 1,'black']])
					.Set('labels', ['Octobre','Novembre','Décembre','Janvier','Février','Mars','Avril','Mai','Juin'])
					.Set('background.grid.autofit',false)
					.Set('background.grid.hsize',7)
					.Set('background.grid.hlines',false)
					.Set('gutter.left', 200) //marge à gauche du graphe
					.Set('gutter.right',50)
					.Set('xmax', 270) //graduation (0->200)
					.Set('adjustable',true)
					.Draw();
			}