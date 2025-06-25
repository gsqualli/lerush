const connection = require('../config/db')
const getEdition = require('./getEdition')


function Register () {}

Register.prototype = {

    isFormValid : function (userInput) {
        for (const [key, value] of Object.entries(userInput)) {
            if (
                (value === null ||
                value === undefined ||
                value === '')
                && !key.includes("prenom") && !key.includes("nom") && !key.includes("regime")
            ) {
                return false 
            }
            if (!key.includes("prenom") && !key.includes("nom") && !key.includes("regime") && value.length > 50) {
                return false
            }
        }
        return true
    },

    find : function (ecole, cb) {
        let sql = ` SELECT *
                    FROM equipes
                    WHERE NOM_ECOLE = ?
                  `
        connection.query(sql, ecole, (err, result) => {
            if (err) throw err
            if (result.length) {
                cb(result[0])
            }
        })
    },

    create : function (body, cb)  {

        const coreInformation = {
                                'nom_asso':body['nom_asso'], 
                                'mail_respo':body['mail_respo'], 
                                'tel_respo':body['tel_respo'], 
                                'moyen_contact':body['moyen_contact'],
                                'moyen_paiement':body['moyen_paiement'],
                                'annee':getEdition(),
                                'moyen_transport': body['moyen_transport'],
                                'nb_place_parking': body['nb_place_parking'],
                                'acces_tf1': body['acces_tf1'],
                                'nb_place_acces_tf1': body['nb_place_acces_tf1'] }

        let sql = ` INSERT INTO equipes
                    (NOM_ECOLE, NOM_ASSO, NOM_RESPO, MAIL_RESPO, TEL_RESPO, MOYEN_CONTACT, MOYEN_PAIEMENT, ANNEE, MOYEN_TRANSPORT, NB_PLACE_PARKING, ACCES_TF1, NB_PLACE_ACCES_TF1)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

                    INSERT INTO participants
                    (PRENOM_PARTICIPANT, NOM_PARTICIPANT, REGIME_PARTICIPANT, ID_EQUIPE, ANNEE)
                    VALUES 
                    `
        let bind = [
                    body['nom_ecole'], 
                    body['nom_asso'],
                    body['nom_respo'],
                    body['mail_respo'],
                    body['tel_respo'],
                    body['moyen_contact'],
                    body['moyen_paiement'],
                    getEdition(),
                    body['moyen_transport'],
                    body['nb_place_parking'],
                    body['acces_tf1'],
                    body['nb_place_acces_tf1']]
        
        for (let i=1; i<8; i++) {
            if (body['nom'+i]!='' && body['prenom'+i]!='') {
                sql += "(?, ?, ?, (SELECT MAX(e.id) FROM equipes AS e), ?),"
                bind = [...bind, body['prenom'+i], body['nom'+i], body['regime'+i], getEdition()]
            }
        }

        sql = sql.slice(0,-1)
        
               
        connection.query(sql, bind, (err, res) => {
            if (err) throw err  
            cb(coreInformation)
        })
               
    }
}

module.exports = Register