import express from 'express';
import mongodb from 'mongodb';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

const dbUrl = 'you data base info'

const validate = (data) =>{
    let errors = {};
    if (data.title === '') errors.title = 'title cannot be empty';
    if (data.cover === '') errors.cover = 'cover cannot be empty';

    const isValid = Object.keys(errors).length === 0;

    return { errors, isValid }
}

mongodb.MongoClient.connect(dbUrl, { useNewUrlParser: true }, (err, client)=>{
    if (err) throw err;

    const db = client.db('sparkmango');

    app.get('/api/games', (req, res) => {
        db.collection('games').find({}).toArray((err, games) => {
          res.json({ games });
        });
    });

    app.post('/api/games', (req, res)=>{
      const { errors, isValid } = validate(req.body);
      if(isValid) {
        const { title, cover } = req.body;
        db.collection('games').insertOne({title, cover}, (err, result)=>{
          if(err){
            res.status(500).json({ errors: {global: 'there is something wrong!'}})
          } else{
            res.json({ game: result.ops[0]})
          }
        });
      } else{
        res.status(400).json({ errors })
      }
    });

    app.use((req, res) => {
      res.status(404).json({
        errors: {
          global: "The server is building up for this feature. Please get noticed when we implement this feature"
        }
      })
    });

    app.listen(8080, () => console.log('server is listened on port 8080'));
})


