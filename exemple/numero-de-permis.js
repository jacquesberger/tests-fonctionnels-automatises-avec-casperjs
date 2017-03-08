/*
  Copyright (C) 2017  CODE3 Cooperative de solidarite

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

casper.test.begin("Attribution d'un numéro de permis", function (test) {

  // Ouvrir la page d'accueil, qui demande une redirection vers une page de
  // login.
  casper.start('http://localhost:3003/', function() {
    test.assertEquals(this.getCurrentUrl(), "http://localhost:3003/login", "Redirection vers la fenêtre de login");
    this.fill("form[action='/login']", {username:"code3", password:"1337"}, true);
  });

  // Après le login, l'application revient à la page d'accueil
  casper.then(function() {
    test.assertEquals(this.getCurrentUrl(), "http://localhost:3003/", "Retour à la page d'accueil après l'authentification");
  });

  // Charger un formulaire de création de dossier, remplir le formulaire et
  // cliquer sur le bouton de soumission
  casper.thenOpen('http://localhost:3003/membre/nouveau', function() {
    this.echo("Création d'un nouveau dossier");
    var form = {
      nom: "Presley",
      prenom: "Elvis",
      sexe: "1",
      date_naissance: "1935-01-08"
    };
    this.fill("form", form, false);
    this.click("button");
    this.wait(1000);
  });

  // Se positionner dans l'onglet Statuts d'admission
  casper.then(function() {
    this.click("a[href='#admission-tabs']");
    test.assertUrlMatch(/^http:\/\/localhost:3003\/membre\/#\/[0-9a-f]{24}\/admission\/statuts/, "L'onglet Statuts est activé");
  });

  // Ajouter le statut d'architecte, ce qui génère automatiquement le numéro de permis
  casper.then(function() {
    this.click("#tab-statuts a.add");
    this.wait(1000, function() {
      this.fill("#statuts-dialog form", {code:"1A4", debut:"2014-04-01"});
      this.wait(1000, function() {
        this.click("#statuts-dialog button.save");
        this.wait(2000, function() {
          var numeroPermis = this.fetchText("#profile .no-permis");
          test.assertMatch(numeroPermis, /^A[0-9]{4}$/, "Numéro de permis valide et visible");
        });
      });
    });
  });

  // Déconnexion
  casper.thenOpen("http://localhost:3003/logout");

  casper.run(function() {
    test.done();
  });
});
