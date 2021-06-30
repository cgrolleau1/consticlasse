//créé par Cédric GROLLEAU juin 2020
//licence CC-BY-NC-SA https://creativecommons.org/licenses/by-nc-sa/4.0/deed.fr


//fichier import colonne 1 nom ; colonne 2 : prenom ; colonne 3 : sexe

var constraintChoiceSelect = '';
var optionsList =[];
var AllOldClasseList = [];
var eleveList;
//********* Gestion du glissé déposé **********
function allowDrop(ev) {
	ev.preventDefault();
}
   
function drag(ev) {
	ev.dataTransfer.setData("Text",ev.target.id);
}
 
function drop(ev) {
	ev.preventDefault();
	var data=ev.dataTransfer.getData("Text");
  let listeLies
  if ($('#'+data).attr('data-linked')) {
      listeLies = $('#'+data).attr('data-linked').split('¤')
  }
	ev.target.appendChild(document.getElementById(data));
  for (let i=0;i<listeLies.length;i++) {
    if(document.getElementById(listeLies[i])) {
      ev.target.appendChild(document.getElementById(listeLies[i]));
    }
  }
	   // Quand on dépose un élève dans une classe on recalcule les effectifs.
	majcounter();
}
//**************************

//******** Initialisation de la matrice***************

function createClasse() {  //création des colonnes pour les classes
	var nbclasses, i, divclasses;
	divclasses = '';
	nbclasses = $(".headerClasse").length;
  i = nbclasses;
	elistlength = eleveList.data.length; 
	divEleves = '';
	infos = Object.keys(eleveList.data[0])
  constraintchoice = [];
  for (i=2; i<infos.length; i++) {
    listvalues = [];
    for (j=2; j<eleveList.data.length; j++) {
      if ( listvalues.indexOf(eleveList.data[j][infos[i]]) <0 ) {
        listvalues.push(eleveList.data[j][infos[i]])
      }     
    }
    constraintchoice.push({columnName:infos[i],listvalues:listvalues});
  }
  selectList = '';
  for (i=2; i<constraintchoice.length ; i++) {
    optionList = '';
    for (j=0 ; j < constraintchoice[i].listvalues.length ; j++) {
      if (constraintchoice[i].columnName !== 'sexe' && constraintchoice[i].columnName !== 'oldclasse' && constraintchoice[i].columnName !== 'info' && constraintchoice[i].columnName !== 'plans' && constraintchoice[i].columnName !== 'suivi' && constraintchoice[i].columnName !== 'resultats'  && constraintchoice[i].columnName !== 'attitude' && constraintchoice[i].listvalues[j]) {
        optionList += `<option value="${constraintchoice[i].columnName + '¤' +constraintchoice[i].listvalues[j]}">${constraintchoice[i].columnName +' : '+constraintchoice[i].listvalues[j]}</option>`;
        optionsList.push(constraintchoice[i].listvalues[j]);
      }
    }
    selectList += optionList;
  }
  selectList = `<select class='ClasseContraintes'>`  + selectList + '</select> <input type="number" class="constraintnumber ClasseContraintes">' ;
  constraintChoiceSelect = selectList;
  i = $(".headerClasse").length + 1;
  divclasses = divclasses + 
    '<div id="headclasse'+i+'" class="headerClasse"><image src="plus.png" id="" onclick="ajouterEleve('+i+')" class="addButton"/>' +
    '<image src="tri.png" id="" onclick="trierEleves('+i+')" class="triButton"/>Classe'+ i +
    ' <div id="message'+i+'" class="message"></div><div class="countdiv">( <span id="countclasse'+i+'" class="countclasse">0</span> élèves) / <input type="number" class="cstr" id="countclassecstr'+i+'" ></div><div id="pcgirls'+i+'" class="pcg"></div><div class="contraintes">'+selectList+'</div>'+
    ' <div><span class="myButton addContrainteBouton" onclick="addSelectList('+i+')"> Ajouter une contrainte de classe </span></div></div>';
    // on récupère les entetes du csv importé pour proposer des elects : 1 premier entete de colonne, 2 une des valeurs presente, input nombre voulu.
	$("#allClasses").append('<div>' + divclasses + '<div id="classe'+i+'" ondrop="drop(event)" ondragover="allowDrop(event)" class="classe"></div>  </div>');
}

function addSelectList(classNum) {
  $('#headclasse'+classNum+' .contraintes').append(constraintChoiceSelect);
}

function createEleveList() { 	//Création de la banque d'élèves.
	var elevecsv, elistlength, i, divEleves, classEleve, infos, planEleve;
	elevecsv = $("#eleveList").val();
	eleveList = Papa.parse(elevecsv, {  //utilisation du package papaparse pour convertir le fichier csv en objet JS
			download: false,
			delimiter: "",	// auto-detect
			newline: "",	// auto-detect
			quoteChar: '"',
			escapeChar: '"',
			header: true,
			transformHeader: undefined,
			dynamicTyping: false,
			preview: 0,
			encoding: "",
			worker: false,
			comments: false,
			step: undefined,
			complete: undefined,
			error: undefined,
			download: false,
			downloadRequestHeaders: undefined,
			downloadRequestBody: undefined,
			skipEmptyLines: false,
			chunk: undefined,
			fastMode: undefined,
			beforeFirstChunk: undefined,
			withCredentials: undefined,
			transform: undefined,
		});
	elistlength = eleveList.data.length; 
	divEleves = '';
	infos = Object.keys(eleveList.data[0]) //on récupère les entetes des colonnes du csv importé pour construire les div eleves.
  for (i=0; i<elistlength; i++) {  //On parcourt chaque élève, à chaque élève on créé une div avec tous les éléments pour faire facilement les filtres et reconstruire un fichier classe.
    div1eleve = '<div ondragstart="drag(event)" onclick="selectEleve($(this))" draggable="true" id="'+eleveList.data[i].nom+'_'+eleveList.data[i].prenom+'" class="eleve '+eleveList.data[i].sexe+' ';
		classEleve = 'eleve ';
    spanoption = '';
    planEleve = '';
    for (j=2; j<infos.length ; j++) {
      if (infos[j] !== 'info' && infos[j] !== 'plans') {
        classEleve = classEleve + ' ' + eleveList.data[i][infos[j]]
      }
      spanoption += `<span class="${infos[j]}eleve hidden">${eleveList.data[i][infos[j]]}</span> ` 
      if (infos[j] === 'plans') {
        if (eleveList.data[i][infos[j]].substr(0,3) === 'SEG') {
          planEleve = `<image src="SEGPA.png" class="SEGPA" title="${eleveList.data[i][infos[j]]}">` 
          classEleve = classEleve + ' ' + 'SEGPA'         
        }
        if (eleveList.data[i][infos[j]].substr(0,3) === 'PAI') {
          planEleve = `<image src="PAI.png" class="PAI" title="${eleveList.data[i][infos[j]]}">`  
          classEleve = classEleve + ' ' + 'PAI'
        }
        if (eleveList.data[i][infos[j]].substr(0,3) === 'PPR') {
          planEleve = `<image src="PPRE.png" class="PPRE" title="${eleveList.data[i][infos[j]]}">`
          classEleve = classEleve + ' ' + 'PPRE'          
        }
        if (eleveList.data[i][infos[j]].substr(0,3) === 'PPS') {
          planEleve = `<image src="PPS.png" class="PPS" title="${eleveList.data[i][infos[j]]}">`  
          classEleve = classEleve + ' ' + 'PPS'
        }
        if (eleveList.data[i][infos[j]].substr(0,3) === 'PAP') {
          planEleve = `<image src="PAP.png" class="PAP" title="${eleveList.data[i][infos[j]]}">`  
          classEleve = classEleve + ' ' + 'PAP'
        }
      }
    }
    
    divEleves = divEleves + '<div ondragstart="drag(event)" onclick="selectEleve($(this))" draggable="true" data-oldClassse="'+eleveList.data[i].oldclasse+'" id="'+eleveList.data[i].nom+'_'+eleveList.data[i].prenom+'" class="'+classEleve+'" >'+planEleve+'<image src="lier.png" class="img_eleve lier_eleve"><image src="separer.png" class="img_eleve separer_eleve"><span class="nom_prenom"  title="'+classEleve+'">'+eleveList.data[i].nom+' '+eleveList.data[i].prenom+'</span><span class="nom_init">'+eleveList.data[i].nom+' '+eleveList.data[i].prenom[0]+'</span><span class="oldclass"> ('+eleveList.data[i].oldclasse+') </span><span hidden class="nomeleve">'+eleveList.data[i].nom+'</span><span hidden class="prenomeleve">'+eleveList.data[i].prenom+'</span><span hidden class="sexeleve">'+eleveList.data[i].sexe+'</span>'+spanoption+'</div>';
	  if (AllOldClasseList.indexOf(eleveList.data[i].oldclasse)<0) {
      AllOldClasseList.push(eleveList.data[i].oldclasse)
    }  
  }
	$('#divlistEleve').html(divEleves);
  $('.nom_init').hide();
  filterHandlers();
}

function init() {
	var selectfiltre =''
  createEleveList();
	createClasse();
  for (let j=0; j<optionsList.length ; j++) {
    selectfiltre += `<option value="${optionsList[j]}">${optionsList[j]}</option>`;
  }
  $('#FilterOption').append(selectfiltre)
  selectfiltre = '';
  for (let j=0; j<AllOldClasseList.length ; j++) {
    selectfiltre += `<option value="${AllOldClasseList[j]}">${AllOldClasseList[j]}</option>`;
  }
  $('#FilterClasse').append(selectfiltre)
  selectfiltre = '';
  var listePlans = ['PPRE','PAP','SEGPA','PPS','PAI'];
  for (let j=0; j<listePlans.length ; j++) {
    selectfiltre += `<option value="${listePlans[j]}">${listePlans[j]}</option>`;
  }
  $('#FilterPlans').append(selectfiltre)
  $('.img_eleve').hide();
  $('.message').hide();
}

var preventDefaultBehavior = function(e) {
   e.preventDefault();      
}

function validerStructure() {
  var i, j, constraintLines, constraintLinesNb, constraintLine, classes,eleveElemList, listeClasse,
    listOpt, listeoptionClasse =[], listOptionsEleve, ClassesForStudent, countoption, allOptions;
  $('.selected').removeClass('selected');
  $(".ClasseContraintes").addClass('readonly');
  $(".ClasseContraintes").bind('mousedown', preventDefaultBehavior);
  classes = $(".headerClasse");
  allOptions = [];
  if (checkStructure()) {
    return;
  }
  for (i=0; i<classes.length+1;i++) { //on parcourt chaque classe.
    constraintLines = $('#headclasse'+i+'  .ClasseContraintes'); //récupère les différentes lignes de contrainte
    constraintLinesNb = constraintLines.length;
    constraintLine = '';
    listOpt = [];
    for (j=0 ; j<constraintLinesNb ; j=j+2) { //pour chaque classe on parcourt chaque ligne pour remplacer les champs à remplir par ce qui a été vérouillé.
      optionConstraint = $('#headclasse'+i+' .ClasseContraintes')[j].value.split('¤')[1]; //selecteur pour trouver l'option choisie
      nombrePourOption = $('#headclasse'+i+' .ClasseContraintes')[j+1].value; //input correpondant à l'option
      if (nombrePourOption > 0) {
        constraintLine += `<div id="div${optionConstraint+i}" class="countdiv"> ${optionConstraint} : <span id="count${optionConstraint+i}">0</span> / <input class="cstr readonly" type="number" id="count${optionConstraint+'cstr'+i}" value="${nombrePourOption}" ></div>`;
      } 
      listOpt.push(optionConstraint);
      allOptions.push(optionConstraint);
    }
    $('#headclasse'+i+' .contraintes').html(constraintLine);
    listeoptionClasse.push({options:listOpt});
  }
  eleveElemList = $('.eleve');
  for (i=0; i<eleveElemList.length ; i++) { //on parcourt chaque eleve. Si les options de l'eleve ne sont présentes que dans une seule classe ils sont mis dans cette classe
    listOptionsEleve = $($('.eleve')[i]).attr('class').split(' ');    
    ClassesForStudent = [];
    for (m=1; m<=classes.length ; m++) {
      countoption = 0;
      for (j=4; j<listOptionsEleve.length ; j++) {
        if (listOptionsEleve[j]=="" || allOptions.indexOf(listOptionsEleve[j])<0 || listeoptionClasse[m].options.indexOf(listOptionsEleve[j])>=0) {
          countoption += 1;
        } 
      }
      if (countoption === (listOptionsEleve.length - 4)) {
        ClassesForStudent.push(m);
      }
    }
    if (ClassesForStudent.length == 1) {
      selectEleve($($('.eleve')[i]))
      $($('.eleve')[i]).append('<image src="cadenas.png" id="" title="option imposant cette classe" class="image_cadenas" />')
      ajouterEleve(ClassesForStudent[0])
    }
  }
  $(".readonly").bind('mousedown', preventDefaultBehavior);
  $(".addContrainteBouton").hide();
  $("#lockButton").hide();
  $("#addClasseButton").hide();
}

function checkStructure() {
  var nbEleve = 0;
  nbClasse = $(".headerClasse").length; 
  for (let i = 1; i<nbClasse+1 ; i++) {
    nbEleve += parseInt($(`#countclassecstr${i}`).val());
  }
  if ($('.eleve').length/2 !== nbEleve) {
    $('#pbStructure').text('problème avec la structure');
    return true
  } else {
    $('#pbStructure').text('');
  }
}

 

//*****************************************************

//****** Extraction des nouvelles classe pour créer un fichier csv *************

function exportfile() {
	var eleveArray = [], elevenumber, eleveList, file, i, k, objEleve ={};
	for (i=1 ; i<7 ; i++) {
			eleveList = $('#classe'+i).children();
			elevenumber = eleveList.length;
			for (k=0; k<elevenumber ; k++) {
				objEleve = {
					nom: $('.nomeleve', eleveList[k]).html(),
					prenom: $('.prenomeleve', eleveList[k]).html(),
					sexe: $('.sexeleve', eleveList[k]).html(),
					classe: 'classe'+i,
					oldclasse: $('.oldclass', eleveList[k]).html(),
					opt: $('.opteleve', eleveList[k]).html(),
					LV2: $('.LV2eleve', eleveList[k]).html()
				};
				eleveArray.push(objEleve);
			}
	}	
	file = Papa.unparse(eleveArray, {
			quotes: false, //or array of booleans
			quoteChar: '"',
			escapeChar: '"',
			delimiter: ",",
			header: true,
			newline: "\r\n",
			skipEmptyLines: false, //or 'greedy',
			columns: null //or array of strings
		});		
	downloadfile(file);
}

function savefile() {	
	downloadfile($('#boxClasses').html());
}

function restorefile() {
  $('#boxClasses').html($("#eleveList").val())
  let contraintes = $(".countdiv");
  for (let i=0 ; i<contraintes.length ; i++) {
    if ($(contraintes[i]).attr('id') && optionsList.indexOf($(contraintes[i]).attr('id').substr(3,$(contraintes[i]).attr('id').length-4))<0 ) {
      optionsList.push($(contraintes[i]).attr('id').substr(3,$(contraintes[i]).attr('id').length-4));
    }
  }
  $('#lockButton').hide();
  filterHandlers();
}

function downloadfile(string) {
	var blob = new Blob(
		[string], {
			type: "application/octet-stream"
		});
    var url  = URL.createObjectURL(blob);
    var link = $(".download-link");
    link.attr("href", url);
    link.attr("download", "classes.txt");
	link.get(0).click();
}

//*****************************


//************ Mise en évidence **********.
function zoomName() {
  if (!$('.nom_init').is(':visible')) {
    $('.nom_prenom').hide()
    $('.nom_init').show()
  } else {
    $('.nom_prenom').show()
    $('.nom_init').hide()
  }
}

$("#sex").change(function(){
	if ($("#sex").prop("checked")) {
		$(".F").addClass('Fhighliht');
	} else {
		$(".F").removeClass("Fhighliht");
	}
})

$("#result").change(function(){
	if ($("#result").prop("checked")) {
		$(".5").addClass('tresbien');
    $(".4").addClass('bien');
    $(".3").addClass('moyen');
    $(".2").addClass('bof');
    $(".1").addClass('argh');
	} else {
    $(".5").removeClass('tresbien');
    $(".4").removeClass('bien');
    $(".3").removeClass('moyen');
    $(".2").removeClass('bof');
    $(".1").removeClass('argh');
	}
})

$("#option").change(function(){
	if ($("#option").prop("checked")) {
		$(".Latin").css("font-weight",'bolder');
		$(".Chorale").css("font-style",'italic');
		$(".LCEESP").css("text-decoration-color",'red');
		$(".LCEESP").css("text-decoration-line",'underline');
		$(".LCEALL").css("text-decoration-color",'yellow');
		$(".LCEALL").css("text-decoration-line",'underline');
	} else {
		$(".Latin").css("font-weight",'normal');
		$(".Chorale").css("font-style",'normal');
		$(".LCEESP").css("text-decoration-line",'none');
		$(".LCEALL").css("text-decoration-line",'none');
	}
})

$("#lang").change(function(){
	if ($("#lang").prop("checked")) {
		$(".ESP").css("border",'3px solid red');
		$(".ANGL").css("border",'3px solid blue');
		$(".ALL").css("border",'3px solid yellow');
	} else {
		$(".ESP").css("border",'1px solid black');
		$(".ANGL").
		css("border",'1px solid black');
		$(".ALL").css("border",'1px solid black');
	}
})

$("#att").change(function(){
	if ($("#att").prop("checked")) {
		$(".Moteur").addClass("MoteurHighlight"); 
		$(".Agite").addClass("AgiteHighlight");
		$(".Public").addClass("PublicHighlight");
		$("#changeAttspan").css('display','inline');
	} else {
		$(".Moteur").removeClass("MoteurHighlight"); 
		$(".Agite").removeClass("AgiteHighlight");
		$(".Public").removeClass("PublicHighlight");
		$("#changeAttspan").css('display','none');
	}
})

$("#infoeleve").change(function(){
	if ($("#infoeleve").prop("checked")) {
		$(".infoeleve").removeClass("hidden");
	} else {
		$(".infoeleve").addClass("hidden");
	}
})

//************** association/séparations élèves **********************
window.addEventListener('keydown', function(e) { 
    if(e.which===69) {
      interactionEleves('lier')
    }
    if(e.which===68) {
      interactionEleves('delier')
    }
    if(e.which===83) {
      interactionEleves('separer')
    }
    if(e.which===88) {
      interactionEleves('deseparer')
    }
  })
  
function trierEleves(numclasse) {
  let eleveList = $('#classe'+numclasse+' .eleve');
  let eleveIdList = [];
  let i;
  for (i = 0; i< eleveList.length;i++) {
    eleveIdList.push($(eleveList[i]).attr('id'));
  }
  eleveIdList.sort()
  for (i = 0; i< eleveIdList.length;i++) {
    $("#classe"+numclasse).append($('#'+eleveIdList[i])); 
  }
  
}

function interactionEleves(type) {
  let selectedList = $('.selected')
  let i,j, linkedList;
  for (i=0; i<selectedList.length; i++) {
    linkedList = '';
    for (j=0; j<selectedList.length ; j++) {
      if (i!==j) {
         linkedList = linkedList + '¤' + $(selectedList[j]).attr('id');
      }
    }
    if (type === 'delier') {
      $(selectedList[i]).attr('data-linked','');
      $(selectedList[i]).find('.lier_eleve').hide();
    }
    if (type === 'deseparer') {
      $(selectedList[i]).attr('data-separe','');
      $(selectedList[i]).find('.separer_eleve').hide();
    }
    if (type === 'lier') {
      $(selectedList[i]).attr('data-linked',linkedList);
      $(selectedList[i]).attr('title',"lié à : "+linkedList+" séparé de : "+$(selectedList[i]).attr("data-separe"));
      $(selectedList[i]).find('.lier_eleve').show();
    }
    if (type === 'separer') {
      $(selectedList[i]).attr('data-separe',linkedList);
      $(selectedList[i]).attr('title',"lié à : "+$(selectedList[i]).attr("data-linked")+" séparé de : "+linkedList);
      $(selectedList[i]).find('.separer_eleve').show();
    }
  }
  $('.selected').removeClass('selected');
}

//********* Filtres et tris***************

function filterHandlers() {

$("#FilterOption").change(function(){
		if($("#FilterOption").val() == "NoFilter") {
			$("#divlistEleve .eleve").css('display','block')
		} else {
			$("#divlistEleve .eleve:not('."+$("#FilterOption").val()+"\')").css('display','none');
			$("#divlistEleve .eleve."+$("#FilterOption").val()).css('display','block');
		}
})

$("#FilterClasse").change(function(){
		if($("#FilterClasse").val() == "NoFilter") {
			$("#divlistEleve .eleve").css('display','block')
		} else {
			$("#divlistEleve .eleve:not('."+$("#FilterClasse").val()+"\')").css('display','none');
			$("#divlistEleve .eleve."+$("#FilterClasse").val()).css('display','block');
		}
})

$("#FilterPlans").change(function(){
		if($("#FilterPlans").val() == "NoFilter") {
			$("#divlistEleve .eleve").css('display','block')
		} else {
			$("#divlistEleve .eleve:not('."+$("#FilterPlans").val()+"\')").css('display','none');
			$("#divlistEleve .eleve."+$("#FilterPlans").val()).css('display','block');
		}
})

$("#langfiltreALL").change(function(){
	if ($("#langfiltreALL").prop("checked")) {
		$("#divlistEleve .eleve:not('.ALL')").css('display','none');
	} else {
		$("#divlistEleve .eleve:not('.ALL')").css('display','block');
	}
})

$("#langfiltreANGL").change(function(){
	if ($("#langfiltreANGL").prop("checked")) {
		$("#divlistEleve .eleve:not('.ANGL')").css('display','none');
	} else {
		$("#divlistEleve .eleve:not('.ANGL')").css('display','block');
	}
})
	
$("#langfiltreESP").change(function(){
	if ($("#langfiltreESP").prop("checked")) {
		$("#divlistEleve .eleve:not('.ESP')").css('display','none');
	} else {
		$("#divlistEleve .eleve:not('.ESP')").css('display','block');
	}
})

$("#attfiltreagite").change(function(){
	if ($("#attfiltreagite").prop("checked")) {
		$("#divlistEleve .eleve:not('.Agite')").css('display','none');
	} else {
		$("#divlistEleve .eleve:not('.Agite')").css('display','block');
	}
})

$("#attfiltremoteurs").change(function(){
	if ($("#attfiltremoteurs").prop("checked")) {
		$("#divlistEleve .eleve:not('.Moteur')").css('display','none');
	} else {
		$("#divlistEleve .eleve:not('.Moteur')").css('display','block');
	}
})

}
//**********Sélection de plusieurs élèves*********

function selectEleve(elem) {
	let listeLies
  if (elem.attr('data-linked')) {
      listeLies = elem.attr('data-linked').split('¤')
  }
  if(elem.hasClass('selected')) {
		if (listeLies) {
      for (let i =0; i<listeLies.length ; i++) {
        $('#'+listeLies[i]).removeClass('selected')
      }
    }
    elem.removeClass('selected');
	} else {
    if (listeLies) {
      for (let i =0; i<listeLies.length ; i++) {
        $('#'+listeLies[i]).addClass('selected')
      }
    }
    elem.addClass('selected');
	}
}

function ajouterEleve(numclasse) {
	$("#classe"+numclasse).append($('.selected'));
  $('.selected').show();
	$('.selected').removeClass('selected');
	majcounter();
  checkLink();
}

//***********Changement de l'attitude d'élèves.

function changeselectedAtt() {
	$('.selected').removeClass('Agite');
	$('.selected').removeClass('Public');
	$('.selected').removeClass('Moteur');
	$('.selected').removeClass('AgiteHighlight');
	$('.selected').removeClass('PublicHighlight');
	$('.selected').removeClass('MoteurHighlight');
	$('.selected').addClass($("#ChangeAtt").val());
	$('.selected').addClass($("#ChangeAtt").val()+"Highlight");
	$('.selected').removeClass('selected');
}

function selectAll() {
	$("#divlistEleve div:visible").addClass('selected');
}

function toggleCount() {
	$(".countdiv").toggle();
}

//**********maj des compteurs, contrôle des contraintes******
function majcounter() {
	var i, eleveList, elevenumber, optionList;
	for (i=1 ; i<7 ; i++) {
    // pourcentage de filles
    eleveList = $('#classe'+i).children();
		elevenumber = eleveList.length;
    if (elevenumber>0) {
        eleveList = $('#classe'+i+' .F');
        pcfilles = (100*eleveList.length/elevenumber).toFixed(0);
        $('#pcgirls'+i).text(pcfilles+"% de filles");
        if (Math.abs(pcfilles-50)>10) {
      $('#pcgirls'+i).css("color","red");
        } else {
      $('#pcgirls'+i).css("color","");
        }
        $('#pcgirls'+i).css("visibility","visible");
    }
    else {
        $('#pcgirls'+i).css("visibility","hidden");
    }
		
		$('#countclasse'+i).text(elevenumber);
    //on parcourt les différentes options, pour chaque option on compte.
    for (j=0; j<optionsList.length ; j++) {
      eleveList = $('#classe'+i+' .'+optionsList[j]);
      elevenumber = eleveList.length;
      $('#count'+optionsList[j]+i).text(elevenumber);
      if (elevenumber == $('#count'+optionsList[j]+'cstr'+i).val()) {
        $('#div'+optionsList[j]+i).removeClass('countKO');
        $('#div'+optionsList[j]+i).addClass('countOK');
      } else {
        $('#div'+optionsList[j]+i).removeClass('countOK');
        $('#div'+optionsList[j]+i).addClass('countKO');
      }
    }
	}
}

function checkLink() {
  var i, eleveList, elevenumber, probleme,listeliens,counts,m,num,listeOldClasseInClasse,n;
  for (i=1 ; i<7 ; i++) {
		probleme = '';
    eleveList = $('#classe'+i).children();
    coupleListe = [];
    oldClasseList =[];
    counts={};
    for(let j=0; j<eleveList.length; j++) {
      //Liste des classes d'origine.
      oldClasseList.push($(eleveList[j]).attr('data-oldClassse'))
      //verification des liens.
      if ($(eleveList[j]).attr('data-linked')) {
        //on récupère la liste des élèves liés et on vérifie qu'ils sont bien dans cette classe.
        listeliens = $(eleveList[j]).attr('data-linked').split('¤');
        for (let k=1; k<listeliens.length;k++) {
          if (!$('#classe'+i).find('#'+listeliens[k])) {
            probleme = probleme + ` ${$(eleveList[j]).attr('id')} et ${listeliens[k]} doivent être dans la même classe \n `
          }
        }  
      }
      if ($(eleveList[j]).attr('data-separe')) {
        //on récupère la liste des élèves liés et on vérifie qu'ils ne sont pas dans la classe
        listeliens = $(eleveList[j]).attr('data-separe').split('¤');
        for (let k=1; k<listeliens.length;k++) {
          if ($('#classe'+i).find('#'+listeliens[k]).attr('id') && 
              coupleListe.indexOf($(eleveList[j]).attr('id')+listeliens[k])<0 && coupleListe.indexOf(listeliens[k]+$(eleveList[j]).attr('id'))<0) {
            coupleListe.push($(eleveList[j]).attr('id')+listeliens[k])
            probleme = probleme + ` ${$(eleveList[j]).attr('id')} et ${listeliens[k]} ne doivent pas être dans la même classe ! \n `
          }
        }
      }
    }
    for (m = 0; m< oldClasseList.length; m++) {
      num = oldClasseList[m]; 
      counts[num] = counts[num] ? counts[num]+1 : 1; 
    }
    listeOldClasseInClasse = Object.keys(counts);
    for (n=0; n<listeOldClasseInClasse.length ;n++) {
      if (counts[listeOldClasseInClasse[n]]==1 && $(`.${listeOldClasseInClasse[n]}`).length !== 1) {
        probleme = probleme + `Un seul élève de ${listeOldClasseInClasse[n]} `;
      }
    }
    if (probleme) {
      $('#message'+i).html(probleme);
      $('#message'+i).show();
      $('#classe'+i).addClass('classeErreur');
    } else {
      $('#message'+i).hide();
      $('#classe'+i).removeClass('classeErreur');
    }
  }
}