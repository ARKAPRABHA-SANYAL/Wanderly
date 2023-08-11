const db = require('../database.js');

const createBookingTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS Booking (
      user_id INT NOT NULL,
      place_id VARCHAR(255) NOT NULL,
      booking_id VARCHAR(255),
      checkIn DATE NOT NULL,
      checkOut DATE NOT NULL,
      numberOfGuests INT NOT NULL,
      name VARCHAR(255) NOT NULL,
      mobile VARCHAR(20) NOT NULL,
      price INT
    )
  `;
  return new Promise((resolve, reject) => {
    db.query(createTableQuery, (err, result) => {
      if (err) {
        reject(err);
      } else {
        console.log('Booking table created successfully');
        resolve(result);
      }
    });
  });
};

const createBooking = async ({
  user_id,
  place_id,
  booking_id,
  checkIn,
  checkOut,
  numberOfGuests,
  name,
  mobile,
  price,
}) => {
  const insertBookingQuery = `
    INSERT INTO Booking (user_id, place_id, booking_id, checkIn, checkOut, numberOfGuests, name, mobile, price)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)
  `;

  const values = [
    user_id,
    place_id,
    booking_id,
    checkIn,
    checkOut,
    numberOfGuests,
    name,
    mobile,
    price,
  ];

  return new Promise((resolve, reject) => {
    db.query(insertBookingQuery, values, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.insertId);
      }
    });
  });
};

const getBookingsByUserId = async (user_id) => {
  const selectBookingsQuery = `
    SELECT b.booking_id, b.place_id, b.checkIn, b.checkOut, b.numberOfGuests, b.name, b.mobile, b.price,
    p.title, p.address, p.photos, p.description, p.perks, p.extraInfo, p.checkIn as placeCheckIn, p.checkOut as placeCheckOut,
    p.maxGuests, p.price as placePrice
    FROM Booking AS b
    JOIN Places AS p ON b.place_id = p.place_id
    WHERE b.user_id = ?
  `;

  return new Promise((resolve, reject) => {
    db.query(selectBookingsQuery, [user_id], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const getBookingByBookingId = async (user_id, booking_id) => {
  const selectBookingQuery = `
    SELECT b.booking_id, b.place_id, b.checkIn, b.checkOut, b.numberOfGuests, b.name, b.mobile, b.price,
    p.title, p.address, p.photos, p.description, p.perks, p.extraInfo, p.checkIn as placeCheckIn, p.checkOut as placeCheckOut,
    p.maxGuests, p.price as placePrice
    FROM Booking AS b
    JOIN Places AS p ON b.place_id = p.place_id
    WHERE b.user_id = ? AND b.booking_id = ?
  `;

  return new Promise((resolve, reject) => {
    db.query(selectBookingQuery, [user_id, booking_id], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result[0]); // Return the first (and only) row of the result set
      }
    });
  });
};





const Booking = {
  BookingSchema: createBookingTable,
  getBookingByBookingId,
  createBooking,
  getBookingsByUserId, // Add this method to fetch bookings by user_id
};

module.exports = Booking;

