const sgMail = require('@sendgrid/mail')
const fs = require('@sendgrid/mail')

const sendEmail =  async(document)=>{
    sgMail.setApiKey('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');;
fs.readFile(document.documentUrl, function(err, data) {
    if(err) return err
    
    sendgrid.send({
        to          : document.receiverEmail,
        from        : cocument.senderEmail,
        subject     : 'Document',
        attachments : [{filename: document.documentName, 
                       content: data,
                       type: 'application/pdf',
                       disposition: document.documentUrl,
                       contentId: 'myId'
        }],
        html        : 'bla bla'
    }).then((response) => {
        return "Success"
      })
      .catch((err) => {
       return err
      });
})
}

module.exports = sendEmail
