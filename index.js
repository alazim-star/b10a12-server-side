const express = require('express');
const app =express()
const cors = require('cors');
const jwt=require('jsonwebtoken')
require('dotenv').config()
// const stripe=require('stripe')(process.env.STRIPE_SECRET_KEY)
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port=process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json()) 






const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9e2ji.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

// for allScholarship  
const scholarshipCollection =client.db('scholarshipDB').collection('allScholarship')
const reviewCollection =client.db('scholarshipDB').collection('reviews')
const userCollection = client.db("scholarshipDB").collection("users")
const applicationCollection = client.db("scholarshipDB").collection("applications")


//middleware 
const verifyToken=(req,res,next)=>{
  console.log('inside verify Token',req.headers.authorization);
  if (!req.headers.authorization) {
    return res.status(401).send({message:'unauthorize access'})
    
  }
  const token =req.headers.authorization.split(' ')[1]
 jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,decoded)=>{
  if (err) {
    return res.status(401).send({message:'unauthorize access'})
  }
  req.decoded=decoded
  next()
 })
}

// jwt token generate


app.post('/jwt',async(req,res)=>{
  const user=req.body
  const token=jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'12h'})
  res.send({ token })

})

// app.post('/jwt', async(req,res)=>{
//   const user=req.body
//   const token=jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'12h'})

//   console.log(token);
//   res
//   .cookie ('token',token,{
//     httpOnly: true,
//                 secure: process.env.NODE_ENV === 'production', 
//                 sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
//   })
//   .send({success:true})
// })


// Auth related APIs jwt token  logout 


// use verify admin after verify token 
const verifyAdmin= async(req,res,next)=>{
  const email=req.decoded.email
  const query={email: email}
  const user=await userCollection.findOne(query)
  const isAdmin=user?.role === 'admin'
  if (!isAdmin) {
    return res.status(403).send({message: 'forbidden access'})
    
  }
  next()

}



//for user related Api 


app.get ('/users',verifyToken,verifyAdmin,async(req,res)=>{
  // console.log(req.headers);
  const result=await userCollection.find().toArray()
  res.send(result)
})

//email er modde teke admin email konta bar korar jonno
app.get('/users/admin/:email', verifyToken, async (req, res) => {
  const email = req.params.email;

  // Check if the email in the route parameter matches the decoded email
  if (email !== req.decoded.email) {
    return res.status(403).send({ message: 'Unauthorized access' });
  }

  const query = { email: email };
  const user = await userCollection.findOne(query);

  let admin = false;
  if (user) {
    admin = user?.role === 'admin'; // Ensure `role` is spelled correctly
  }

  res.send({ admin });
});







//user er email store korar jonno 
app.post('/users',async(req,res)=>{
  const user=req.body
  // jodi email akta take user er tahole abar sei email save hobe na 
  // insert email if use doesnot exists:
  //you can do this in many ways (1,email unique 2. upsert 3.simple checking)
  const query={email:user.email}
  const existingUser=await userCollection.findOne(query)
  if (existingUser) {
    return res.send({message : 'user already exists',insertedId:null})
    
  }
  const result =await userCollection.insertOne(user)
  res.send(result)
})

//user delet korar jonno
app.delete('/users/:id',verifyToken,verifyAdmin,async(req,res) => {
  const id =req.params.id
  const query={_id: new ObjectId(id)}
  const result=await userCollection.deleteOne(query)
  res.send(result)


})


// / for all reviews related api
app.get('/reviews',async(req,res)=>{
    const result=await reviewCollection.find().toArray()
    res.send(result)
})



app.get('/reviews/:id', async (req, res) => {
  const id = req.params.id
const query={_id:new ObjectId(id)}
const result=await reviewCollection.findOne(query)
res.send(result)
});



// POST: Submit a new review
app.post('/reviews', async (req, res) => {
  const newReview = req.body;
console.log(newReview);
const result=await reviewCollection.insertOne(newReview)
res.send(result)
});







/// for read using get 
app.get('/allScholarship',async(req,res)=>{
    const result=await scholarshipCollection.find().toArray()
        res.send(result)
    
}) 


// for give data in server use post 
app.post('/allScholarship', async (req,res)=>{
    const newScholarship=req.body
    console.log(newScholarship);
    const result=await scholarshipCollection.insertOne(newScholarship)
    res.send(result)
})


// application related api 
app.get('/applications',async(req,res)=>{
  const cursor =applicationCollection.find()
  const result=await cursor.toArray()
      res.send(result)
  
}) 


app.delete('/applications/:id',async(req,res)=>{
    const id=req.params.id 
    const query={_id:new ObjectId(id)}
    const result =await applicationCollection.deleteOne(query)
    res.send(result)
  
  })


app.get("/applications/:email",async (req, res) => {
    const email = req.params.email; 
    console.log({email});
    const query={email:email}

    console.log('cookies for cookies',req.cookies);
    
      const result = await applicationCollection.find( query ).toArray();
      res.send(result);
      // console.log(result);
    
  });

app.post('/applications',async(req,res)=>{
  const newApplication=req.body
  console.log('creating new client',newApplication);
  const result=await applicationCollection.insertOne(newApplication)
  res.send(result)
})

// / update 
  app.patch('/applications/:id',async(req,res)=>{
    const id =req.params.id
    const data=req.body 
    const filter={_id: new ObjectId(id)}
    const updatedDoc={
      $set:{
        status:data.status
      }
    }
    const result=await  applicationCollection.updateOne(filter,updatedDoc)
    res.send(result)

  })

  // for update data use get
app.get('/applications/:id',async(req,res)=>{
  const id=req.params.id
  const query={_id:new ObjectId(id)}
  const result =await applicationCollection.findOne(query)
  res.send(result)
})


app.put('/applications/:id', async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) }; 
    const options = { upsert: true }; 
    const applying = req.body; 
  

    const applyings = {
      $set: {
    
  
       applyingDate:applying.applyingDate
       
       
      },
    };
  
  
    const result = await applicationCollection.updateOne(filter,applyings,options);
  
  
    res.send(result);
  });






    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get ('/',(req,res)=>{
    res.send("scholar crude is running")

})
app.listen(port,()=>{
    console.log(`scholar crud in running port:${port}`);
})


