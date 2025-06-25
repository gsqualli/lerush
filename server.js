require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const Register = require('./core/register')
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const request = require('request')
const app = express()
const sendMail = require('./config/mailer')
const authenticateToken = require('./middleware/auth')
const search = require('./core/search')
const getEdition = require('./core/getEdition')

const tableResultat = search.tableResultat
const intoTable = search.intoTable
app.set('view engine', 'ejs');
// Middlewares
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())

// Routes
// To access file.png in static/img, you need to use '/img/file.png'
app.use(express.static('static'))

// ****************************************** HEADER ****************************************** \\

app.get('/header', (req, res) => {
    res.sendFile('./pages/header.html', { root: __dirname })
})

app.get('/header.js', (req, res) => {
    res.sendFile('./pages/header.js', { root: __dirname })
})


// ****************************************** FOOTER ****************************************** \\

app.get('/footer', (req, res) => {
    res.sendFile('./pages/footer.html', { root: __dirname })
})


// ******************************************* HOME ******************************************* \\

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/pages/home.html')
})


// **************************************** PRESENTATION *************************************** \\

app.get('/presentation', (req, res) => {
    res.sendFile(__dirname + '/pages/presentation.html')
})


// ************************************* DERNIERES EDITIONS ************************************ \\

app.get('/editions', (req, res) => {
    res.sendFile(__dirname + '/pages/editions.html')
})

app.get('/edition2023', (req, res) => {
    res.sendFile(__dirname + '/pages/edition2023.html')
})
app.get('/edition2022', (req, res) => {
    res.sendFile(__dirname + '/pages/edition2022.html')
})
app.get('/edition2021', (req, res) => {
    res.sendFile(__dirname + '/pages/edition2021.html')
})
app.get('/edition2020', (req, res) => {
    res.sendFile(__dirname + '/pages/edition2020.html')
})
app.get('/edition2019', (req, res) => {
    res.sendFile(__dirname + '/pages/edition2019.html')
})
app.get('/edition2018', (req, res) => {
    res.sendFile(__dirname + '/pages/edition2018.html')
})
// ************************************* PROCHAINE EDITION ************************************ \\

app.get('/prochaine_edition', (req, res) => {
    res.sendFile(__dirname + '/pages/prochaine_edition.html')
})


// **************************************** INSCRIPTION *************************************** \\


app.get('/inscription', (req, res) => {
    res.sendFile(__dirname + '/pages/inscription.html')
})
app.get('/registered', (req, res) => {
    res.sendFile(__dirname + '/pages/registered.html')
})

app.post('/inscription', (req, res) => {

    const register = new Register()
    // check if every field is correctly filled
    if (
        req.body['g-recaptcha-response'] === undefined ||
        req.body['g-recaptcha-response'] === '' ||
        req.body['g-recaptcha-response'] === null
    ) {
        return res.json({ "success": false, "msg": "Please select captcha" })
    }

    let userInput = {
        'nom_ecole': req.body.nom_ecole,
        'nom_asso': req.body.nom_asso,
        'nom_respo': req.body.nom_respo,
        'mail_respo': req.body.mail_respo,
        'tel_respo': req.body.tel_respo,
        'moyen_contact': req.body.moyen_contact,
        'moyen_paiement': req.body.moyen_paiement,
        'moyen_transport': req.body.moyen_transport.join(', '), // array to string
        'nb_place_parking': req.body.nb_place_parking,
        'acces_tf1': req.body.acces_tf1,
        'nb_place_acces_tf1': req.body.nb_place_acces_tf1,
    }

    for (let i = 1; i < 8; i++) {
        if (req.body["nom" + i] !== null || req.body["prenom" + i] !== null) {
            userInput["nom" + i] = req.body["nom" + i]
            userInput["prenom" + i] = req.body["prenom" + i]
            userInput["regime" + i] = req.body["regime" + i]
        }
    }

    if (!register.isFormValid(userInput)) {
        return res.json({ "success": false, "msg": "Form is invalid" })
    }


    // verify captcha
    // Secret Key
    const secretKey = process.env.SECRET_KEY

    // Verify URL
    const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body['g-recaptcha-response']}&${req.connection.remoteAddress}`

    // Make request to VerifyURL
    request(verifyUrl, (err, response, body) => {

        body = JSON.parse(body)
        // If captcha failed
        if (body.success !== undefined && !body.success) {
            return res.json({ "success": false, "msg": "Failed captcha verification" })
        }

        // Captcha passed
        if (body.success) {
            register.create(userInput, (result) => {
                res.sendFile(__dirname + '/pages/registered.html')
                const content = `
                Une nouvelle inscription a été réalisée sur le site du Rush !

                L'équipe inscrite est : ${result['nom_asso']}
                L'adresse mail du respo est : ${result['mail_respo']}
                Le numéro de téléphone du respo est : ${result['tel_respo']}
                Le moyen de contact souhaité est : ${result['moyen_contact']}

                Cordialement,

                server.js
                `
                sendMail('festival.lerush@gmail.com', 'Nouvelle inscription sur le site du Rush !', content, (err, info) => {
                    if (err) throw err
                })
            })


        }
    })

})


// ***************************************** REGLEMENT **************************************** \\

app.get('/reglement', (req, res) => {
    res.sendFile('./pages/reglement.html', { root: __dirname })
})


// ************************************** INTERFACE ADMIN ************************************ \\
app.get('/participation/:recherche/:annee?', authenticateToken, (req, res) => {
    const recherche = req.params.recherche;
    const annee = req.params.annee || getEdition();
    tableResultat(annee, recherche, (result)=>{
        res.status(200).render("participation",{title: recherche, table : intoTable(result)})
    })

})

const admins = [{
    name: process.env.ADMIN_ID,
    password: process.env.ADMIN_PWD
}]

// app.post('/addAdmin', async (req,res) => {
//     try {
//         const salt = await bcrypt.genSalt()
//         const hashedPassword = await bcrypt.hash(req.body.password, salt)
//         const admin = { name : req.body.name, password : hashedPassword}
//         admins.push(admin)
//         console.log(admin)
//         res.status(201).send("account created")
//     } catch(err) { res.status(500).send("issue while creating account "+err) }
// })
app.get('/admin', (req, res) => {
    res.sendFile(__dirname + "/pages/admin.html")
})

app.post('/admin', async (req, res) => {
    const admin = admins.find(admin => admin.name === req.body.name)
    try {
        if (admin == null) {
            res.status(200).send('invalid user')
        } else {
        if (await bcrypt.compare(req.body.password, admin.password)) {
            const accessToken = jwt.sign(admin, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'})
            res.cookie('authorization', "Bearer "+accessToken, { sameSite: true });
            res.status(200).redirect('/participation/equipes')
        } else {
            res.status(200).send("invalid password")
        }
        }
    } catch (err) { res.status(500).send("issue while authenticating " + err) }
})

app.listen(8080, () => {
    console.log('Rush app is running on port 8080')
})