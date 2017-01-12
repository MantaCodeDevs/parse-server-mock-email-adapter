"use strict"
const nodemailer = require('nodemailer')
const stubTransport = require('nodemailer-stub-transport')

const stubMailer = nodemailer.createTransport(stubTransport())

const removeLinebreaks = (message) => {
    return message.replace(/=\r?\n/g, '').replace(/=3D/g, '=')
}

const MockParseEmailAdapter = (options) => {
    const sendMail = (mail) => {
        const mailOptions = {
            from: options.fromAddress,
            to: mail.to,
            html: mail.text,
            subject: mail.subject,
        }

        return new Promise((resolve, reject) => {
            stubMailer.sendMail(mailOptions, (error, info) => {
                if (error) {
                    reject(error)
                } else {
                    if (!!info && !!info.response) {
                        console.log(removeLinebreaks(info.response.toString()))
                    }

                    resolve(info)
                }
            })
        })
    }

    return {
        sendMail: sendMail
    }
}

module.exports = MockParseEmailAdapter