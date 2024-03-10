// to fetch from database 

const express = require('express');
const mongoose=require("mongoose");
const app = express();
const session = require('express-session');
const crypto = require('crypto'); 

// const Toastify =require('toastify-js')
const secretKey = crypto.randomBytes(32).toString('hex');
const PORT = 8000;
const multer = require('multer');
const bodyParser = require('body-parser');

mongoose.connect('mongodb+srv://yuvaraj0313:X7xYDWxajUbc8VVb@cluster0.26ivkzw.mongodb.net/Documents', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

function isAuthenticated(req, res, next) {
  if (req.session && req.session.authenticated) {
    console.log(req.session)
    return next();
  } else {
    return res.redirect('/login');
  }
}


const conn = mongoose.connection;
const itemSchema = new mongoose.Schema({
  authorName: { type: String },
  publishedDate: { type: Date},
  patentTitle:{type:String},
  patentStatus:{type:String},
  Department:{type:String},
  iprApplicationNumber:{type:String},
  data: Buffer,
  contentType: String
});

const loginSchema= new mongoose.Schema({
  Username:{type:String},
  Email:{type:String},
  Password:{type:String},
 
  
  
})
const conferenceSchema = new mongoose.Schema({
  Department:{type:String},
  authorName: { type: String },
  paperTitle:{type:String},
  conferenceName:{type:String},
  scopusIndexed:{type:String},
  
  data:String
});
const booksSchema = new mongoose.Schema({
  aurthorName:{type:String},
  bookTitle: { type: String },
  paperTitle:{type:String},
  proceedingsOfTheConference:{type:String},
  conferenceName:{type:String},
  NationalInternational:{type:String},
  year:{type:String},
  issn:{type:String},
  publisherName:String,
  Department:{type:String},
});


const articleSchema = new mongoose.Schema({
  paperTitle:String,
  authorName: { type: String },
  Department:{type:String},
  journalName:{type:String},
  year:{type:String},
  ISSNNumber:{type:String},
  
  data:String
});



const projectSchema = new mongoose.Schema({
  inventorName:String,
  projectTitle:String,
  Investigators: { type: String },
  Department:{type:String},
  fundingAgency:{type:String},
  amount:{type:String},
  CompletionDate:{type:String},

  
});

                
               




app.use(express.static('views'));
const Item = mongoose.model('patents', itemSchema,

);
const Login = mongoose.model('login', loginSchema

);
const Conference = mongoose.model('conferences', conferenceSchema

);
const article = mongoose.model('article', articleSchema

);
const books = mongoose.model('books', booksSchema

);
const project = mongoose.model('project', projectSchema

);



app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: secretKey, resave: true, saveUninitialized: true })); // Use the generated secret key


app.set('view engine', 'ejs');

app.get('/',async(req,res)=>{
  const totalCount = await Item.countDocuments({});
  const totalCountarticle = await article.countDocuments({});
  const totalCountconference = await Conference.countDocuments({});
  const totalCountbooks = await books.countDocuments({});
  const totalCountproject = await project.countDocuments({});
  res.render('firstpage',{totalCount,totalCountarticle,totalCountconference,totalCountbooks,totalCountproject})
})
app.get('/admin', async (req, res) => {
  
  try {
    const totalCount = await Item.countDocuments({});
    const items = await Item.find();
    let i=1;
  
   
    await res.render('index', {items,totalCount,i});
   
    
  } catch (err) {
    res.redirect('/404')
  }
});
app.get('/Conferenceadmin' ,async (req, res) => {
  
  try {
    const totalCount = await Conference.countDocuments({});
    const items = await Conference.find();
  
   
   
    await res.render('adminconference', {items,totalCount});
   
    
  } catch (err) {
    res.redirect('/404')
  }
});
app.get('/articleadmin', async (req, res) => {
  
  try {
    const totalCount = await article.countDocuments({});
    const items = await article.find();
  
   console.log(items)
   
    await res.render('articleadmin', {items,totalCount});
   
    
  } catch (err) {
    res.redirect('/404')
  }
});


app.get('/booksadmin',async (req, res) => {
  
  try {
    const totalCount = await books.countDocuments({});
    const items = await books.find();
    console.log(items)
   
   
    await res.render('booksadmin', {items,totalCount});
   
    
  } catch (err) {
    res.redirect('/404')
  }
});


app.get('/projectadmin',async (req, res) => {
  
  try {
    const totalCount = await project.countDocuments({});
    const items = await project.find();
    console.log(items)
   
   
    await res.render('projectadmin', {items,totalCount});
   
    
  } catch (err) {
    res.redirect('/404')
  }
});




 // Use the generated secret key


app.get('/404',async(req,res)=>{
  res.render('404')
})






app.get('/cards',async (req, res) => {
  
  try {
    
    items=''
    await res.render('cards', {items});
   
    
  } catch (err) {
    res.redirect('/404')
  }
});
app.get('/cardsAdmin', async (req, res) => {
  
  try {
    
    items=''
    await res.render('cardsAdmin', {items});
   
    
  } catch (err) {
    res.redirect('/404')
  }
});


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/login', (req, res) => {
  const textToDisplay = "";
  res.render('login', { textToDisplay });
});

app.post('/login', async (req, res) => {
  try {
    const Email = req.body.Email;
    const Password = req.body.Password;
    const use = req.body.userType;
    const secretkey = req.body.secretKey;

    const user = await Login.findOne({ Email: Email });
    const user_pass = await Login.findOne({ Password: Password });

    // Add a condition to check if the email contains "velammalitech.edu.in"
    if (secretkey === "vitpatents" && user && user_pass && Email.includes("velammalitech.edu.in")) {
      req.session.authenticated = true;
      res.redirect('/cardsAdmin');
    } else if (user && user_pass && secretkey !== "vitpatents" && use === 'Admin') {
      const textToDisplay = "SecretKey Entered Wrong";
      res.render('login', { textToDisplay });
    } else if (user && user_pass && use === 'User' && Email.includes("velammalitech.edu.in")) {
      req.session.authenticated = true;
      res.redirect('/cards');
    } else {
      const textToDisplay = "Email Or Password Entered Wrong";
      res.render('login', { textToDisplay });
    }
  } catch (error) {
    console.error(error);
    res.redirect('/404')
  }
});

app.get('/forgot-password', (req, res) => {
  res.render('forgotPassword'); // Render a form to input the email for password reset
});

app.post('/forgot-password', async (req, res) => {
  try {
    const email = req.body.email;
    // Check if the email exists in your database
    const user = await Login.findOne({ Email: email });

    if (user) {
      // Generate a unique token for password reset
      const resetToken = generateResetToken(); // Implement a function to generate a token

      // Save this reset token and its expiration time to the user document in the database
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; // Token expiration time (1 hour)

      // Save the user document with the updated reset token information
      await user.save();

      // Send an email to the user with a link to reset the password using the resetToken
      sendResetPasswordEmail(email, resetToken); // Implement a function to send the reset password email
     
      // Redirect the user to a page confirming that an email has been sent
      res.redirect('/password-reset-sent');
    } else {
      // If the email doesn't exist in the database, show an error message
      res.render('forgotPassword', { error: 'Email not found' });
    }
  } catch (error) {
    console.error(error);
    res.redirect('/404');
  }
});
// Function to generate a random token for password reset
function generateResetToken() {
  const tokenLength = 20;
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < tokenLength; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return token;
}

app.get('/password-reset-sent', (req, res) => {
  res.render('passwordResetSent'); // Render a page confirming the password reset email has been sent
});

const nodemailer = require('nodemailer');

// Function to send reset password email
async function sendResetPasswordEmail(email, resetToken) {
  // Create a Nodemailer transporter
  let transporter = nodemailer.createTransport({
    // Your email configuration (SMTP, OAuth, etc.)
    // Example using Gmail SMTP:
    service: 'Gmail',
    auth: {
      user: 'harini200329@gmail.com',
      pass: 'tqdy zfvn xqaf mqfm'
  },
  });

  // Email content
  let mailOptions = {
    from: 'yuavaraj0313@gmail.com', // Sender address
    to: email, // Recipient address
    subject: 'Password Reset', // Subject line
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n`
      + `Please click on the following link, or paste this into your browser to complete the process:\n\n`
      + `localhost:8000/reset-password/${resetToken}\n\n`
      + `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
  console.log("email sent")
}

app.get('/reset-password/:token', async (req, res) => {
  try {
    const token = req.params.token;
    // Find a user with the provided token and check if the token is still valid (not expired)
    const user = await Login.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Check if the token is not expired
    });
console.log(token)
    if (token) {
      // Render a form to reset the password, passing the token as a hidden field
      res.render('resetPassword', { token });
    } else {
      // If the token is invalid or expired, show an error message
      res.render('resetPassword', { error: 'Invalid or expired token' });
    }
  } catch (error) {
    console.error(error);
    res.redirect('/404');
  }
});

app.post('/reset-password/:token', async (req, res) => {
  try {
    const mailid=req.body.email;
    const token = req.params.token;
    const newPassword = req.body.newPassword;

    // Find a user with the provided token and check if the token is still valid (not expired)
    const user = await Login.findOne({Email:mailid});

    if (user) {
      // Update the user's password with the new password
      user.Password = newPassword;
      // Clear the reset token and its expiration as the password has been reset
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      // Save the updated user document with the new password
      await user.save();
console.log(user)
      // Redirect the user to the login page after successful password reset
      res.redirect('/login'); // Redirect to the login page or any desired route
    } else {
      // If the token is invalid or expired, show an error message or redirect to an error page
      res.render('resetPassword', { error: 'Invalid or expired token' });
    }
  } catch (error) {
    console.error(error);
    res.redirect('/404');
  }
});



const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.use(bodyParser.urlencoded({ extended: false }));




app.get('/store' ,(req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.get('/conferencestore', (req, res) => {
  res.sendFile(__dirname + '/ConfernceStore.html');
});
app.get('/articlestore', (req, res) => {
  res.sendFile(__dirname + '/article.html');
});
app.get('/booksstore' ,(req, res) => {
  res.sendFile(__dirname + '/books.html');
});
app.get('/projectstore',(req, res) => {
  res.sendFile(__dirname + '/project.html');
});






app.get('/patentsubmit', (req, res) => {
  res.sendFile(__dirname + '/submit.html');
});

app.post('/patentsubmit',upload.single('patentFile') ,async (req, res) => {
  if (!req.file) {
                 return res.status(400).send('No file uploaded.');
             }
    const  authorName  = req.body.authorName;
    const  publishedDate  = req.body.publishedDate;
    const  patentTitle  = req.body.patentTitle;
    const  iprApplicationNumber  = req.body.iprApplicationNumber;
   const patentStatus=req.body.patentStatus;
   const Department=req.body.Department;

    try {
       //await Items.insertMany({ authorName,publishedDate ,});

        const newFormData = new Item({
            authorName:authorName,
            publishedDate:publishedDate,
            patentTitle:patentTitle,
            patentStatus:patentStatus,
            iprApplicationNumber:iprApplicationNumber,
            Department:Department,
            data: req.file.buffer,
            contentType: req.file.mimetype
            
        });
        await newFormData.save();
        res.sendFile(__dirname + '/views/submit.html');
        
    } catch (error) {
        console.error(error);
        res.redirect('/404')
    }
});




app.get('/bookssubmit',(req, res) => {
  res.sendFile(__dirname + '/submit.html');
});

app.post('/bookssubmit',upload.single('patentFile') ,async (req, res) => {

    const  authorName  = req.body.aurthorName;
    const  bookTitle  = req.body.bookTitle;
    const  paperTitle  = req.body.paperTitle;
    const  proceedingsOfTheConference  = req.body.proceedingsOfTheConference;
   const conferenceName=req.body.conferenceName;
   const NationalInternational=req.body.NationalInternational;
   const year=req.body.year;
   const issn=req.body.issn;
   const publisherName=req.body.publisherName;
   const Department=req.body.Department;

    try {
       //await Items.insertMany({ authorName,publishedDate ,});

        const newFormData = new books({
          aurthorName:authorName,
            bookTitle:bookTitle,
            paperTitle:paperTitle,
            proceedingsOfTheConference:proceedingsOfTheConference,
            conferenceName:conferenceName,
            NationalInternational:NationalInternational,
            year:year,
            issn:issn,
            publisherName:publisherName,
            Department:Department


          
            
        });
        await newFormData.save();
        res.sendFile(__dirname + '/views/submit.html');
        
    } catch (error) {
        console.error(error);
        res.redirect('/404')
    }
});






app.get('/articlesubmit' ,(req, res) => {
  res.sendFile(__dirname + '/submit.html');
});

app.post('/articlesubmit',async (req, res) => {
 
    const  patentTitle  = req.body.patentTitle;
    const  authorName  = req.body.authorName;
    const  Department  = req.body.Department;
    const  journalName  = req.body.journalName;
   const year=req.body.year;
   const issn=req.body.issn;
   const data=req.body.articleLink

    try {
       //await Items.insertMany({ authorName,publishedDate ,});
      
       
       
        const newFormData = new article({
          paperTitle:patentTitle,
          authorName:authorName,
          Department:Department,
          journalName:journalName,
          year:year,
          ISSNNumber:issn,
          data:data,
            
            
        });
        await newFormData.save();
        res.sendFile(__dirname + '/views/submit.html');
        
    } catch (error) {
        console.error(error);
        res.redirect('/404')
    }
});




app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/submit' ,(req, res) => {
  res.sendFile(__dirname + '/submit.html');
});
app.post('/submit',upload.single('patentFile') ,async (req, res) => {
  
    const  authorName  = req.body.authorName;
    
    const  paperTitle  = req.body.patentTitle;
    const   scoupous= req.body.Scoupous;
   const conname=req.body.conferencename;
   const Department=req.body.Department;
   const link=req.body.conferenceLink

    try {
       //await Items.insertMany({ authorName,publishedDate ,});

        const newFormData = new Conference({
          
Department:Department,
authorName: authorName,
paperTitle:paperTitle,
conferenceName:conname,
scopusIndexed:scoupous,
data:link

            
        });
        await newFormData.save();
        res.sendFile(__dirname + '/views/submit.html');
        
    } catch (error) {
        console.error(error);
        res.redirect('/404')
    }
});





app.get('/projectsubmit', (req, res) => {
  res.sendFile(__dirname + '/submit.html');
});
app.post('/projectsubmit',async (req, res) => {
  
    const  inventorName  = req.body.inventorName;
    
    const  Investigators  = req.body.Investigators;
    const projectTitle =req.body.projectTitle;
    const   Department= req.body.Department;
   const fundingAgency=req.body.fundingAgency;
   const amount=req.body.amount;
   const CompletionDate=req.body.CompletionDate

    try {
       

        const newFormData = new project({
          inventorName:inventorName,
          projectTitle:projectTitle,
          Investigators: Investigators,
          Department:Department,
          fundingAgency:fundingAgency,
          amount:amount,
          CompletionDate:CompletionDate,

            
        });
        await newFormData.save();
        res.sendFile(__dirname + '/views/submit.html');
        
    } catch (error) {
        console.error(error);
        res.redirect('/404')
    }
});




app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get('/registeredlogin', async (req, res) => {
  
  try {
    const textToDisplay = "";
    await res.render('registeredlogin' ,{textToDisplay});
    
  } catch (err) {
    res.redirect('/404')
  }
});


app.post('/registeredlogin', async (req, res) => {


  try {
    const Email = req.body.Email;
    const Password = req.body.Password;
    const use = req.body.userType;
    const secretkey = req.body.secretKey;

    const user = await Login.findOne({ Email: Email });
    const user_pass = await Login.findOne({ Password: Password });

    if (secretkey === "vitpatents" && user && user_pass && Email.includes("velammalitech.edu.in")) {
      req.session.authenticated = true;
      res.redirect('/cardsAdmin');
    } else if (user && user_pass && secretkey !== "vitpatents" && use === 'Admin') {
      const textToDisplay = "SecretKey Entered Wrong";
      res.render('login', { textToDisplay });
    } else if (user && user_pass && use === 'User' && Email.includes("velammalitech.edu.in")) {
      req.session.authenticated = true;
      res.redirect('/cards');
    } else {
      const textToDisplay = "Email Or Password Entered Wrong";
      res.render('login', { textToDisplay });
    }
  } catch (error) {
    console.error(error);
    res.redirect('/404')
  }
}
  )

app.get('/register', async (req, res) => {
  
  try {
    const textToDisplay = "";
   await res.render('reg', {textToDisplay});
    
    
  } catch (err) {
    res.redirect('/404')
  }
});

app.post('/register', async (req, res,next) => {
  try{
 const username=req.body.Username
 const email=req.body.Email
 const password=req.body.Password

 const newLogin = new Login({
  Username:username,
  Email:email,
  Password:password
  
});
await newLogin.save();


const textToDisplay = "You are registred ";
await res.render( 'success')



  }
  catch (error) {
    console.error(error);
    res.redirect('/404')
}
});


app.get('/view/:fileId', async (req, res) => {
  const fileId = req.params.fileId;
  
  try {
      const patent = await Item.findById(fileId);
      
      if (!patent) {
        res.redirect('/404')
      }
      
      const pdfData = patent.data; 
      const pdfBuffer = Buffer.from(pdfData.buffer, 'base64');
      
      res.set('Content-Type', 'application/pdf');
      res.send(pdfBuffer);
  } catch (error) {
      console.error(error);
      res.redirect('/404')
  }
});

app.get('/reg', async (req, res) => {
  
  try {
    const textToDisplay = "";
   await res.render('details', {textToDisplay});
    
    
  } catch (err) {
    res.redirect('/404')
  }
});



//to have a table
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/table', async (req, res) => {
  try {
    const totalCount = await Item.countDocuments({});
    let j=1;
    const items = await Item.find();

    await res.render('table', {totalCount,items,j});
    
  } catch (err) {
    res.redirect('/404')
  }

  
});

app.post('/table', async (req, res) => {
  const { Department } = req.body;
  
  try {
    let items;
    if (Department && Department !== 'User') {
      items = await Item.find({ Department }); // Fetch items based on Department
    } else {
      items = await Item.find(); // Fetch all items if no specific Department is selected
    }
    
    // Send items to the template for rendering
    res.render('table', { items, totalCount: items.length }); // Replace 'your_template' with your actual template file
  } catch (err) {
    console.error('Error fetching items:', err);
    res.status(500).send('Internal Server Error');
  }
});
app.get('/getFacultyNames', async (req, res) => {
  try {
    const facultyNames = await Item.distinct('authorName'); // Fetch unique author names
    res.json({ facultyNames }); // Send the unique faculty names as JSON response
  } catch (err) {
    console.error('Error fetching faculty names:', err);
    res.status(500).send('Internal Server Error');
  }
});
app.get('/getFacultyNamesconference', async (req, res) => {
  try {
    const facultyNames = await Conference.distinct('authorName'); // Fetch unique author names
    res.json({ facultyNames }); // Send the unique faculty names as JSON response
  } catch (err) {
    console.error('Error fetching faculty names:', err);
    res.status(500).send('Internal Server Error');
  }
});
app.get('/getFacultyNamesbooks', async (req, res) => {
  try {
    const facultyNames = await books.distinct('authorName'); // Fetch unique author names
    res.json({ facultyNames }); // Send the unique faculty names as JSON response
  } catch (err) {
    console.error('Error fetching faculty names:', err);
    res.status(500).send('Internal Server Error');
  }
});
app.get('/getFacultyNamesproject', async (req, res) => {
  try {
    const facultyNames = await project.distinct('authorName'); // Fetch unique author names
    res.json({ facultyNames }); // Send the unique faculty names as JSON response
  } catch (err) {
    console.error('Error fetching faculty names:', err);
    res.status(500).send('Internal Server Error');
  }
});
app.get('/getFacultyNamesarticle', async (req, res) => {
  try {
    const facultyNames = await article.distinct('authorName'); // Fetch unique author names
    res.json({ facultyNames }); // Send the unique faculty names as JSON response
  } catch (err) {
    console.error('Error fetching faculty names:', err);
    res.status(500).send('Internal Server Error');
  }
});



// Handle POST request for AuthorName filter
app.post('/table/filterbyauthor', async (req, res) => {
  const { AuthorName } = req.body;
  
  console.log('AuthorName:', AuthorName);

  try {
    const items = await Item.find({ authorName: AuthorName });

    if (items.length === 0) {
      console.log('No items found for AuthorName:', AuthorName);
    }
let j=1
    res.render('table', { j,items, totalCount: items.length });
  } catch (err) {
    console.error('Error fetching items by author:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/table/filterbyauthorconnfernce', async (req, res) => {
  const { AuthorName } = req.body;
  
  console.log('AuthorName:', AuthorName);

  try {
    const items = await Conference.find({ authorName: AuthorName });

    if (items.length === 0) {
      console.log('No items found for AuthorName:', AuthorName);
    }
let j=1
    res.render('Conferencetable', { j,items, totalCount: items.length });
  } catch (err) {
    console.error('Error fetching items by author:', err);
    res.status(500).send('Internal Server Error');
  }
});
app.post('/table/filterbyauthorbooks', async (req, res) => {
  const { AuthorName } = req.body;
  
  console.log('AuthorName:', AuthorName);

  try {
    const items = await books.find({ authorName: AuthorName });

    if (items.length === 0) {
      console.log('No items found for AuthorName:', AuthorName);
    }
let j=1
    res.render('bookstable', { j,items, totalCount: items.length });
  } catch (err) {
    console.error('Error fetching items by author:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/table/filterbyauthorarticle', async (req, res) => {
  const { AuthorName } = req.body;
  
  console.log('AuthorName:', AuthorName);

  try {
    const items = await article.find({ authorName: AuthorName });

    if (items.length === 0) {
      console.log('No items found for AuthorName:', AuthorName);
    }
let j=1
    res.render('articletable', { j,items, totalCount: items.length });
  } catch (err) {
    console.error('Error fetching items by author:', err);
    res.status(500).send('Internal Server Error');
  }
});
app.post('/table/filterbyauthorproject', async (req, res) => {
  const { AuthorName } = req.body;
  
  console.log('AuthorName:', AuthorName);

  try {
    const items = await project.find({ authorName: AuthorName });

    if (items.length === 0) {
      console.log('No items found for AuthorName:', AuthorName);
    }
let j=1
    res.render('projecttable', { j,items, totalCount: items.length });
  } catch (err) {
    console.error('Error fetching items by author:', err);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/projecttable',async (req, res) => {
  try {
    const totalCount = await project.countDocuments({});
    let j=1;
    const items = await project.find();

    await res.render('projecttable', {totalCount,items,j});
    
  } catch (err) {
    res.redirect('/404')
  }

  
});

app.post('/projecttable',async (req, res) => {
  try {
    
    const FilterDepartment=req.body.Department
    const totalCount = await project.countDocuments({Department:req.body.Department});
    console.log(FilterDepartment)
    const items = await project.find({Department:FilterDepartment});
   let j=1
    await res.render('projecttable', {totalCount,items,j});
    
  } catch (err) {
    res.redirect('/404')
  }

  
});



app.get('/Conferencetable',async (req, res) => {
  try {
    const totalCount = await Conference.countDocuments({});
    let j=1;
    const items = await Conference.find();

    await res.render('Conferencetable', {totalCount,items,j});
    
  } catch (err) {
    res.redirect('/404')
  }

  
});
app.post('/Conferencetable',async (req, res) => {
  try {
    
    const FilterDepartment=req.body.Department
    const totalCount = await Conference.countDocuments({Department:req.body.Department});
    console.log(FilterDepartment)
    const items = await Conference.find({Department:FilterDepartment});
    console.log(items)
    await res.render('Conferencetable', {totalCount,items});
    
  } catch (err) {
    res.redirect('/404')
  }

  
});





app.get('/articletable', async (req, res) => {
  try {
    const totalCount = await article.countDocuments({});
    let j=1;
    const items = await article.find();
     console.log(items)
    await res.render('articletable', {totalCount,items,j});
    
  } catch (err) {
    res.redirect('/404')
  }

  
});
app.post('/articletable',async (req, res) => {
  try {
    
    const FilterDepartment=req.body.Department
    const totalCount = await article.countDocuments({Department:req.body.Department});
    console.log(FilterDepartment)
    const items = await article.find({Department:FilterDepartment});
    console.log(items)
    await res.render('articletable', {totalCount,items});
    
  } catch (err) {
    res.redirect('/404')
  }

  
});

app.get('/bookstable', async (req, res) => {
  try {
    const totalCount = await books.countDocuments({});
    let j=1;
    const items = await books.find();

    await res.render('bookstable', {totalCount,items,j});
    
  } catch (err) {
    res.redirect('/404')
  }

  
});

app.post('/bookstable',async (req, res) => {
  try {
    
    const FilterDepartment=req.body.Department
    const totalCount = await books.countDocuments({Department:req.body.Department});
    console.log(FilterDepartment)
    const items = await books.find({Department:FilterDepartment});
   let j=1
    await res.render('bookstable', {totalCount,items,j});
    
  } catch (err) {
    res.redirect('/404')
  }

  
});





const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const { array } = require('mongoose/lib/utils');






const canvasRenderService = new ChartJSNodeCanvas({ width: 800, height: 400});

app.get('/chart', async (req, res) => {
  try {
    // Fetch data from MongoDB using Mongoose
    const data = await Item.find().exec();
   let arr=[]
    // Process the data if necessary
    const labels =['IT','CSE','MECH','MTS','EEE','ECE']
    for (var i=0;i<6;i++){
      const totalCount = await Item.countDocuments({Department:labels[i]});
      arr.push(totalCount)
       

    }
    


    const values =arr
    console.log(values)

    // Create a bar chart using Chart.js Node Canvas
    const configuration = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Data from MongoDB',
          data: values,
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',   // Red
            'rgba(54, 162, 235, 0.5)',  // Blue
            'rgba(255, 206, 86, 0.5)',  // Yellow
            'rgba(75, 192, 192, 0.5)',  // Teal
            'rgba(204, 255, 204, 0.7)',  // Pastel Green
            'rgba(255, 204, 255, 0.7)',  // Pastel Purple
            
          ],
        }],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            display: true,
          },
        },
      },
    };

    // Render the chart
    const image = await canvasRenderService.renderToBuffer(configuration);
    res.contentType('image/png').send(image);
  } catch (error) {
    console.error(error);
    res.redirect('/404')
  }
});


app.get('/bookschart', async (req, res) => {
  try {
    // Fetch data from MongoDB using Mongoose
    const data = await books.find().exec();
   let arr=[]
    // Process the data if necessary
    const labels =['IT','CSE','MECH','MTS','EEE','ECE']
    for (var i=0;i<6;i++){
      const totalCount = await books.countDocuments({Department:labels[i]});
      arr.push(totalCount)
       

    }
    


    const values =arr
    console.log(values)

    // Create a bar chart using Chart.js Node Canvas
    const configuration = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Data from MongoDB',
          data: values,
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',   // Red
            'rgba(54, 162, 235, 0.5)',  // Blue
            'rgba(255, 206, 86, 0.5)',  // Yellow
            'rgba(75, 192, 192, 0.5)',  // Teal
            'rgba(204, 255, 204, 0.7)',  // Pastel Green
            'rgba(255, 204, 255, 0.7)',  // Pastel Purple
            
          ],
        }],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            display: true,
          },
        },
      },
    };

    // Render the chart
    const image = await canvasRenderService.renderToBuffer(configuration);
    res.contentType('image/png').send(image);
  } catch (error) {
    console.error(error);
    res.redirect('/404')
  }
});


app.get('/projectchart', async (req, res) => {
  try {
    // Fetch data from MongoDB using Mongoose
    const data = await project.find().exec();
   let arr=[]
    // Process the data if necessary
    const labels =['IT','CSE','MECH','MTS','EEE','ECE']
    for (var i=0;i<6;i++){
      const totalCount = await project.countDocuments({Department:labels[i]});
      arr.push(totalCount)
       

    }
    


    const values =arr
    console.log(values)

    // Create a bar chart using Chart.js Node Canvas
    const configuration = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Data from MongoDB',
          data: values,
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',   // Red
            'rgba(54, 162, 235, 0.5)',  // Blue
            'rgba(255, 206, 86, 0.5)',  // Yellow
            'rgba(75, 192, 192, 0.5)',  // Teal
            'rgba(204, 255, 204, 0.7)',  // Pastel Green
            'rgba(255, 204, 255, 0.7)',  // Pastel Purple
            
          ],
        }],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            display: true,
          },
        },
      },
    };

    // Render the chart
    const image = await canvasRenderService.renderToBuffer(configuration);
    res.contentType('image/png').send(image);
  } catch (error) {
    console.error(error);
    res.redirect('/404')
  }
});










app.get('/conferencechart', async (req, res) => {
  try {
    // Fetch data from MongoDB using Mongoose
    const data = await Conference.find().exec();
   let arr=[]
    // Process the data if necessary
    const labels =['IT','CSE','MECH','MTS','EEE','ECE']
    for (var i=0;i<6;i++){
      const totalCount = await Conference.countDocuments({Department:labels[i]});
      arr.push(totalCount)
       

    }
    


    const values =arr
    console.log(values)

    // Create a bar chart using Chart.js Node Canvas
    const configuration = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Data from MongoDB',
          data: values,
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',   // Red
            'rgba(54, 162, 235, 0.5)',  // Blue
            'rgba(255, 206, 86, 0.5)',  // Yellow
            'rgba(75, 192, 192, 0.5)',  // Teal
            'rgba(204, 255, 204, 0.7)',  // Pastel Green
            'rgba(255, 204, 255, 0.7)',  // Pastel Purple
            
          ],
        }],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            display: true,
          },
        },
      },
    };

    // Render the chart
    const image = await canvasRenderService.renderToBuffer(configuration);
    res.contentType('image/png').send(image);
  } catch (error) {
    console.error(error);
    res.redirect('/404')
  }
});



app.get('/articlechart', async (req, res) => {
  try {
    // Fetch data from MongoDB using Mongoose
    const data = await article.find().exec();
   let arr=[]
    // Process the data if necessary
    const labels =['IT','CSE','MECH','MTS','EEE','ECE']
    for (var i=0;i<6;i++){
      const totalCount = await article.countDocuments({Department:labels[i]});
      arr.push(totalCount)
       

    }
    


    const values =arr
    console.log(values)

    // Create a bar chart using Chart.js Node Canvas
    const configuration = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Data from MongoDB',
          data: values,
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',   // Red
            'rgba(54, 162, 235, 0.5)',  // Blue
            'rgba(255, 206, 86, 0.5)',  // Yellow
            'rgba(75, 192, 192, 0.5)',  // Teal
            'rgba(204, 255, 204, 0.7)',  // Pastel Green
            'rgba(255, 204, 255, 0.7)',  // Pastel Purple
            
          ],
        }],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            display: true,
          },
        },
      },
    };

    // Render the chart
    const image = await canvasRenderService.renderToBuffer(configuration);
    res.contentType('image/png').send(image);
  } catch (error) {
    console.error(error);
    res.redirect('/404')
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Secret Key:', secretKey)
});
