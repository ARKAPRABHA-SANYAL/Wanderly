const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const adminRoutes = require('./admin');
const db = require('./database.js');
const User = require('./models/user.js');
const jwtSecret = 'dbhdbsahjcbsjbdkwd';
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs= require('fs');
const Places = require('./models/place.js');
const Booking =  require('./models/booking.js');
const { v4: uuidv4 } = require('uuid');

const app = express();


app.use('/uploads',express.static(__dirname+'/uploads'));
app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));
app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000',
}));

app.get('/test', (req, res) => {
  res.json('test ok');
});

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const checkEmailQuery = `
      SELECT * FROM users WHERE email = ? LIMIT 1
    `;

    db.query(checkEmailQuery, [email], async (err, results) => {
      if (err) {
        console.error('Error while checking email:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      if (results.length > 0) {
        // Email already exists, return an error
        res.status(400).json({ error: 'Email already exists' });
        return;
      }
      const userId = await User.createUser({ name, email, password });
      res.json({ id: userId, name, email });
    });
  } catch (err) {
    console.error('Error while creating user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});





app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordMatch = await User.comparePassword(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate the JWT token
    const token = jwt.sign(
      {
        email: user.email,
        id:user.id,
      },
      jwtSecret,
      {}
    );

    // Set the token in the response cookie with HttpOnly flag
    res.cookie('token', token, { httpOnly: true });

    // Send the response with the token and user information
    res.json({ message: 'Authentication successful', token, user });
  } catch (err) {
    console.error('Error while logging in:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(4000, () => {
  console.log('Server is running on http://localhost:4000');
});

User.createTable()
  .then(() => {
    console.log('Table created successfully!');
  })
  .catch((err) => {
    console.error('Error creating table:', err);
  });



app.use('/admin', adminRoutes);

app.get('/profile',(req,res)=>{
  const{token}=req.cookies;
  if (token){
    jwt.verify(token,jwtSecret,async(err,userData)=>{
        if (err) { console.error('Error while verifying token:', err);
        res.status(401).json({ error: 'Authentication failed' });
        return};
        const {name,email,id} = await User.findUserByEmail(userData.email);
        res.json({name,email,id});
        
    })
  }else{
    res.json(null);
  }
  
  
});

app.post('/logout', (req,res)=>{
  res.cookie('token','').json(true);
});

app.post('/upload-by-link',async(req,res)=>{
  const{link}=req.body;
  
  const newName ='photo'+Date.now()+'.jpg';
  await imageDownloader.image({
    url: link,
    dest: __dirname + '/uploads/' + newName,
  });
  res.json(newName);
})

const photosMiddleware =multer({dest:'uploads/'});

app.post('/upload',photosMiddleware.array('photos',100),(req,res) => {
  const uploadedFiles = [];
  for(let i=0;i<req.files.length;i++){
    const {path,originalname} = req.files[i];
    const parts = originalname.split('.');
    const ext =parts[parts.length -1];
    const newPath = path+'.'+ext;
    fs.renameSync(path,newPath);
    uploadedFiles.push(newPath.replace('uploads\\',''));
  }
  res.json(uploadedFiles);

});

const place =require('./models/place.js');


app.post('/places', async (req, res) => {
  const { token } = req.cookies;
  const {
    title,
    address,
    addedphotos,
    description,
    perks,
    extraInfo,
    checkin,
    checkout,
    maxguests,
    price,
  } = req.body;

  try {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) {
        console.error('Error while verifying token:', err);
        res.status(401).json({ error: 'Authentication failed' });
        return;
      }

      // Find the user in the database based on the email in the token
      const user = await User.findUserByEmail(userData.email);
      const placeId = uuidv4();

      if (!user) {
        console.error('User not found in the database');
        res.status(404).json({ error: 'User not found' });
        return;
      }

      const placeData = {
        owner_id: user.id,
        place_id: placeId, // Use the owner's ID from the user data
        title,
        address,
        photos:addedphotos,
        description,
        perks: JSON.stringify(perks), // Store perks as a JSON string
        extraInfo,// Store extrainfo as a JSON string
        checkIn: checkin,
        checkOut: checkout,
        maxGuests: maxguests,
        price,
      };

      
      
      // Store the placeData in the database
      const placeDoc = await Places.createPlace(placeData);
      const response = {
        ...placeDoc,
        place_id: placeId,
      };
      res.json(response);
    });
  } catch (error) {
    console.error('Error while creating place:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


   

app.get('/user-places', async (req, res) => {
  const { token } = req.cookies;

  try {
    const userData = jwt.verify(token, jwtSecret);

    // Extract the email from the userData
    const { email } = userData;

    // Find the user in the database based on the email
    const user = await User.findUserByEmail(email);

    if (!user) {
      console.error('User not found in the database');
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch places for the authenticated user's ID
    const places = await Places.getAllPlacesByOwner(user.id);

    res.json(places);
  } catch (error) {
    console.error('Error while fetching places:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/places/:place_id',async(req,res) => {
  const {place_id} =req.params;
  res.json(await Places.getPlaceById(place_id))
})

app.put('/places',async(req,res)=>{
  const {token} = req.cookies;
  const {
    place_id,
    title,
    address,
    addedphotos,
    description,
    perks,
    extraInfo,
    checkin,
    checkout,
    maxguests,
    price,
  } = req.body;
  jwt.verify(token, jwtSecret,{},async(err, userData)=>{
    if(err) throw err;
    const placeDoc = await Places.getPlaceById(place_id);
    console.log(userData);
    if(userData.id === placeDoc.owner_id){
      
       await Places.updatePlace(
        place_id,
        title,
        address,
        addedphotos,
        description,
        perks,
        extraInfo,
        checkin,
        checkout,
        maxguests,
        price
      );
      res.json('ok');
    }
  })
})


app.get('/places',async(req,res)=>{
  res.json(await place.getAllPlaces())
})


// ... Other required imports ...

app.post('/bookings', async (req, res) => {
  const { token } = req.cookies;
  const {
    checkIn,
    checkOut,
    numberOfGuests,
    name,
    mobile,
    place_id,
    price
  } = req.body;

  try {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) {
        console.error('Error while verifying token:', err);
        res.status(401).json({ error: 'Authentication failed' });
        return;
      }

      // Find the user in the database based on the email in the token
      const user = await User.findUserByEmail(userData.email);
      const BookingId = uuidv4();

      if (!user) {
        console.error('User not found in the database');
        res.status(404).json({ error: 'User not found' });
        return;
      }

      const bookingData = { 
        user_id: user.id,
        place_id,
        booking_id: BookingId,
        checkIn,
        checkOut,
        numberOfGuests,
        name,
        mobile,
        price
      };

      // Store the bookingData in the database
      const bookingDoc = await Booking.createBooking(bookingData);
      const response = {
        ...bookingDoc,
        booking_id: BookingId,
      };
     
      res.json(response);
    });
  } catch (error) {
    console.error('Error while creating booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/bookings', async (req, res) => {
  const { token } = req.cookies;

  try {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) {
        console.error('Error while verifying token:', err);
        res.status(401).json({ error: 'Authentication failed' });
        return;
      }

      // Find the user in the database based on the email in the token
      const user = await User.findUserByEmail(userData.email);

      if (!user) {
        console.error('User not found in the database');
        res.status(404).json({ error: 'User not found' });
        return;
      }

      // Fetch bookings for the authenticated user's ID
      const bookings = await Booking.getBookingsByUserId(user.id);

      res.json(bookings);
    });
  } catch (error) {
    console.error('Error while fetching bookings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/bookings/:booking_id', async (req, res) => {
  const { token } = req.cookies;
  const { booking_id } = req.params;
  console.log("Server received Booking ID:", booking_id); 
  try {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) {
        console.error('Error while verifying token:', err);
        res.status(401).json({ error: 'Authentication failed' });
        return;
      }

      // Find the user in the database based on the email in the token
      const user = await User.findUserByEmail(userData.email);

      if (!user) {
        console.error('User not found in the database');
        res.status(404).json({ error: 'User not found' });
        return;
      }

      // Fetch the specific booking for the authenticated user's ID and the given booking_id
      const booking = await Booking.getBookingByBookingId(user.id, booking_id);

      if (!booking) {
        console.error('Booking not found in the database');
        res.status(404).json({ error: 'Booking not found' });
        return;
      }

      res.json(booking);
    });
  } catch (error) {
    console.error('Error while fetching booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



User.createTable()
  .then(() => {
    console.log('User table created successfully!');
    return place.PlaceSchema(); // Create the Places table after the User table is created
  })
  .then(() => {
    console.log('Places table created successfully!');
    app.listen(5000, () => {
      console.log('Server is running on http://localhost:5000');
    });
  })
  .catch((err) => {
    console.error('Error creating tables:', err);
  });

  app.get('/search', async (req, res) => {
    const { query } = req.query;
  
    try {
      const searchResults = await Places.findPlacesByAddress(query);
      res.json(searchResults);
    } catch (error) {
      console.error('Error searching places:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  Booking.BookingSchema()
  .then(() => {
    console.log('Booking table created successfully!');
    // Start the server after the tables have been created
    app.listen(6000, () => {
      console.log('Server is running on http://localhost:6000');
    });
  })
  .catch((err) => {
    console.error('Error creating Booking table:', err);
  });