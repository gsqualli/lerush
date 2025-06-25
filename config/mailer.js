const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth    : {
        user    : process.env.MAIL_USER,
        pass    : process.env.MAIL_PASS
    }
})

function sendMail (recipient, subject, text, cb) {

    const mailOptions = {
        from    : process.env.MAIL_USER,
        to      : recipient,
        subject : subject,
        text    : text
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) throw err
        cb(info)
    })
}

module.exports = sendMail