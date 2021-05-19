//créé par Cédric GROLLEAU juin 2020
//licence CC-BY-NC-SA https://creativecommons.org/licenses/by-nc-sa/4.0/deed.fr


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

function createClasses() {  //création des colonnes pour les classes
	var nbclasses, i, divclasses;
	divclasses ='';
	nbclasses = $("#nbclasses").val(); //Utilisation du nombre de classes donné par l'utilisateur.
	for (i=1; i<=nbclasses; i++) {
		divclasses = divclasses + '<div id="headclasse'+i+'" class="headerClasse"><image src="plus.png" id="" onclick="ajouterEleve('+i+')" class="addButton"/><image src="tri.png" id="" onclick="trierEleves('+i+')" class="triButton"/>Classe'+ i +' <div id="message'+i+'" class="message"></div><div class="countdiv">( <span id="countclasse'+i+'" class="countclasse">0</span> élèves) / <input type="number" class="cstr" id="countclassecstr'+i+'" ></div> <div class="countdiv" id="divlatin'+i+'"> Latin : <span id="countlatin'+i+'"> 0 </span> / <input class="cstr" type="number" id="countlatincstr'+i+'"></div> <div id="divall'+i+'" class="countdiv"> ALL  : <span id="countAll'+i+'">0</span> / <input class="cstr" type="number" id="countallcstr'+i+'"></div><div id="divesp'+i+'" class="countdiv"> ESP  : <span id="countesp'+i+'">0</span> / <input class="cstr" type="number" id="countespcstr'+i+'"></div><div id="divangl'+i+'" class="countdiv"> ANGL : <span id="countangl'+i+'">0</span> / <input type="number" class="cstr" id="countanglcstr'+i+'"></div></div>';
	}
	for (i=nbclasses; i<6; i++) {
		divclasses = divclasses + '<div id="header'+i+'"></div>';
	}
	for (i=1; i<(Number.parseInt(nbclasses)+1); i++) {
		divclasses = divclasses + '<div id="classe'+i+'" ondrop="drop(event)" ondragover="allowDrop(event)" class="classe">  </div>'
	}
	$("#allClasses").html(divclasses);
}

function createEleveList() { 	//Création de la banque d'élèves.
	var elevecsv, eleveList, elistlength, i, divEleves;
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
	for (i=0; i<elistlength; i++) {  //On parcours chaque élève, à chaque élève on créé une div avec tous les éléments pour faire facilement les filtres et reconstruire un fichier classe.
		divEleves = divEleves + '<div ondragstart="drag(event)" onclick="selectEleve($(this))" draggable="true" id="'+eleveList.data[i].nom+'_'+eleveList.data[i].prenom+'" class="eleve '+eleveList.data[i].sexe+' '+eleveList.data[i].opt+' '+eleveList.data[i].attitude+' '+eleveList.data[i].LV2+' '+eleveList.data[i].resultats+'"><image src="lier.png" class="img_eleve lier_eleve"><image src="separer.png" class="img_eleve separer_eleve"><span class="nom_prenom">'+eleveList.data[i].nom+' '+eleveList.data[i].prenom+'</span><span class="nom_init">'+eleveList.data[i].nom+' '+eleveList.data[i].prenom[0]+'</span><span class="oldclass"> ('+eleveList.data[i].classe+') </span><span class="result">'+eleveList.data[i].resultats+'</span><span hidden class="nomeleve">'+eleveList.data[i].nom+'</span><span hidden class="prenomeleve">'+eleveList.data[i].prenom+'</span><span hidden class="sexeleve">'+eleveList.data[i].sexe+'</span><span hidden class="opteleve">'+eleveList.data[i].opt+'</span><span hidden class="LV2eleve">'+eleveList.data[i].LV2+'</span></div>';
	}
	$('#divlistEleve').html(divEleves);
  $('.nom_init').hide()
}

function init() {
	createEleveList();
	createClasses();
  $('.img_eleve').hide();
  $('.message').hide();
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

$("#result").change(function(){
	if ($("#result").prop("checked")) {
		$(".result").css("display","inline");
	} else {
		$(".result").css("display","none");
	}
})

//********* Filtres et tris***************

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
}

$("#FilterOption").change(function(){
		if($("#FilterOption").val() == "NoFilter") {
			$("#divlistEleve .eleve").css('display','block')
		} else {
			$("#divlistEleve .eleve:not('."+$("#FilterOption").val()+"\')").css('display','none');
			$("#divlistEleve .eleve."+$("#FilterOption").val()).css('display','block');
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
	var i, eleveList, elevenumber;
	for (i=1 ; i<7 ; i++) {
		eleveList = $('#classe'+i).children();
		elevenumber = eleveList.length;
		$('#countclasse'+i).text(elevenumber);
		eleveList = $('#classe'+i+' .Latin');
		elevenumber = eleveList.length;
		$('#countlatin'+i).text(elevenumber);
		if (elevenumber == $('#countlatincstr'+i).val()) {
			$('#divlatin'+i).removeClass('countKO');
			$('#divlatin'+i).addClass('countOK');
		} else {
			$('#divlatin'+i).removeClass('countOK');
			$('#divlatin'+i).addClass('countKO');
		}
		eleveList = $('#classe'+i+' .ALL');
		elevenumber = eleveList.length;
		$('#countAll'+i).text(elevenumber);
		if (elevenumber == $('#countallcstr'+i).val()) {
			$('#divall'+i).removeClass('countKO');
			$('#divall'+i).addClass('countOK');
		} else {
			$('#divall'+i).removeClass('countOK');
			$('#divall'+i).addClass('countKO');
		}
		eleveList = $('#classe'+i+' .ESP');
		elevenumber = eleveList.length;
		$('#countesp'+i).text(elevenumber);
		if (elevenumber == $('#countespcstr'+i).val()) {
			$('#divesp'+i).removeClass('countKO');
			$('#divesp'+i).addClass('countOK');
		} else {
			$('#divesp'+i).removeClass('countOK');
			$('#divesp'+i).addClass('countKO');
		}
		eleveList = $('#classe'+i+' .ANGL');
		elevenumber = eleveList.length;
		$('#countangl'+i).text(elevenumber);
		if (elevenumber == $('#countanglcstr'+i).val()) {
			$('#divangl'+i).removeClass('countKO');
			$('#divangl'+i).addClass('countOK');
		} else {
			$('#divangl'+i).removeClass('countOK');
			$('#divangl'+i).addClass('countKO');
		}
	}
}

function checkLink() {
  var i, eleveList, elevenumber, probleme,listeliens;
  for (i=1 ; i<7 ; i++) {
		probleme = '';
    eleveList = $('#classe'+i).children();
    coupleListe = [];
    for(let j=0; j<eleveList.length; j++) {
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