const connection = require('../config/db')

exports.intoTable = function(result){
    var table = [Object.keys(result[0])]
    for(let i = 0; i<result.length; i++){
        table.push(Object.values(result[i]))
    }
    return table
};

function Search() {
    this.desc="Requetes SQL"
}
Search.prototype.findEcole = function (annee, ecole, cb) {
        let sql = ` SELECT *
                    FROM equipes
                    WHERE NOM_ECOLE = ?
                    AND ANNEE = ?
                  `
        var total = [];
        var query = connection.query(sql, ecole, annee)
        query
        .on('error', (err)=>{
            cb([{'error':'An error has occured'}]);
            console.log(err)
        })
        .on('result', (result)=>{
            total.push(result)
        })
        .on('end', () => {
            if (total.length) {
                cb(total)
            } else {
                cb([{'id': null,
                'NOM_ECOLE': null,
                'NOM_ASSO': null,
                'NOM_RESPO': null,
                'MAIL_RESPO': null,
                'TEL_RESPO': null,
                'MOYEN_CONTACT': null,
                'MOYEN_PAIEMENT': null,
                'ANNEE': annee
               }])
            }
        })
    }

Search.prototype.findEquipe = function(annee, equipe, cb) {
        let sql = ` SELECT p.*
                    FROM participants AS p JOIN equipes AS e
                    ON p.ID_EQUIPE = e.id
                    WHERE e.id = ?
                    AND p.ANNEE = ?
                  `
        var total = [];
        var query = connection.query(sql, [equipe, annee])
        query
        .on('error', (err)=>{
            console.log(err);
            cb([{'error':'An error has occured'}])
        })
        .on('result', (result)=>{
            total.push(result)
        })
        .on('end', () => {
            if (total.length) {
                cb(total)
            } else {
                cb([{'ID_RESPO': null,
                'PRENOM_PARTICIPANT': null,
                'NOM_PARTICIPANT': null,
                'REGIME_PARTICIPANT': null,
                'ID_EQUIPE': null,
                'ANNEE': annee
               }])
            }
        })
    }
Search.prototype.allEcoles = function(annee, cb) {
        let sql = ` SELECT *
                    FROM equipes
                    WHERE ANNEE = ?
                  `
        var total = [];
        var query = connection.query(sql, annee);
        query
        .on('error', (err)=>{
            console.log(err);
            cb([{'error':'An error has occured'}])
        })
        .on('result', (result) => {
            total.push(result)
        })
        .on('end', ()=>{
            if(total.length) {
                cb(total)
            } else {
                cb([{'id': null,
                     'NOM_ECOLE': null,
                     'NOM_ASSO': null,
                     'NOM_RESPO': null,
                     'MAIL_RESPO': null,
                     'TEL_RESPO': null,
                     'MOYEN_CONTACT': null,
                     'MOYEN_PAIEMENT': null,
                     'ANNEE': annee
                    }])
                }
        })
    }
Search.prototype.allParticipants = function(annee, cb) {
        let sql = ` SELECT *
                    FROM participants
                    WHERE ANNEE = ?
                  `
        var total = [];
        var query = connection.query(sql, annee)
        query
        .on('error', (err)=>{
            console.log(err);
            cb([{'error':'An error has occured'}])
        })
        .on('result', (result)=>{
            total.push(result)
        })
        .on('end', () => {
            if (total.length) {
                cb(total)
                } else {
                    cb([{'ID_PARTCIPANT': null,
                    'PRENOM_PARTICIPANT': null,
                    'NOM_PARTICIPANT': null,
                    'REGIME_PARTICIPANT': null,
                    'ID_EQUIPE': null,
                    'ANNEE': annee
                   }])
                }
        })
    }

exports.tableResultat = function(annee, recherche, cb) {
    search = new Search()
    if(recherche=="equipes") {
        search.allEcoles(annee, (result)=>{
            cb(result)
        })
        
    }
    else {
    if(recherche=="participants") {
        search.allParticipants(annee, (result)=>{
            cb(result)
        })
    } else {
        search.findEquipe(annee, recherche, (result) => {
            cb(result)
        })
    }
    }
}
