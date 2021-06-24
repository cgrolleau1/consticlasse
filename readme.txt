créé par Cédric GROLLEAU 
https://creativecommons.org/licenses/by-nc-sa/4.0/
Ce(tte) œuvre est mise à disposition selon les termes de la Licence Creative Commons Attribution - Pas d’Utilisation Commerciale - Partage Dans les mêmes conditions 4.0 International


Pour modèle pour le csv à importer voir le fichier listeexemple.csv

Pour la mise en forme :
* Latin (penser à la majuscule)


LV2 :
* Allemand (à noter ALL dans le csv)
* Anglais (à noter ANGL dans le csv)
* Espagnol (à noter ESP dans le csv)

"Type d'élèves"
* Agite
* Moteur
* Bon Public

*Formule pour la colonne LV2 à partir de pronote :
=SI(ESTNUM(CHERCHE("ESPAGNOL LV2";G2));"ESP";SI(ESTNUM(CHERCHE("ANGLAIS LV2";G2));"ANGL";SI(ESTNUM(CHERCHE("ALLEMAND LV2";G2));"ALL";" ")))
