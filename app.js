const express = require('express')
const aws = require('aws-sdk')

const app = express()
app.set('views', './views')
app.use(express.static('./public'))
app.engine('html', require('ejs').renderFile)
app.listen(process.env.PORT || 3000)

const S3_BUCKET = process.env.S3_BUCKET
aws.config.region = 'us-west-2'

app.get('/account', (req, res) => res.render('account.html'))

app.get('/sign-s3', (req, res) => {
  const s3 = new aws.S3();
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
});

app.post('/save-details', (req, res) => {
  console.log('req.body in save-details:', req.body)
})
