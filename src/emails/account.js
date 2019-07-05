const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: "contato@larissavarjao.com",
        subject: "Thanks for joining in!",
        text: `Welcome to the app, ${name}. Let me know how you get along with the app!`
    });
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: "contato@larissavarjao.com",
        subject: "We are very sorry for you leaving",
        text: `If you're having some problem with the app, ${name}, please let us know. We hope to see you soon!`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}