const db = require('../database.js');

const createPlaceTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS Places (
      owner_id INT,
      place_id varchar(255),
      title VARCHAR(255),
      address VARCHAR(255),
      photos VARCHAR(255),
      description TEXT,
      perks VARCHAR(255),
      extraInfo TEXT,
      checkIn INT,
      checkOut INT,
      maxGuests INT,
      price INT ,
      FOREIGN KEY (owner_id) REFERENCES users(id)

    )
  `;
  return new Promise((resolve, reject) => {
  db.query(createTableQuery, (err, result) => {
    if (err) {
      reject(err);
    } else {
      console.log('Places table created successfully');
      resolve(result);
    }
  });
});
};

const createPlace = async ({
  owner_id,
  place_id,
  title,
  address,
  photos,
  description,
  perks,
  extraInfo,
  checkIn,
  checkOut,
  maxGuests,
  price,
}) => {
  const insertPlaceQuery = `
    INSERT INTO Places (owner_id,place_id, title, address, photos, description, perks, extraInfo, checkIn, checkOut, maxGuests,price)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
  `;

  const values = [
    owner_id,
    place_id,
    title,
    address,
    JSON.stringify(photos),
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  ];

  return new Promise((resolve, reject) => {
    db.query(insertPlaceQuery, values, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.insertId);
      }
    });
  });
};

const getAllPlacesByOwner = async (ownerId) => {
  const selectPlacesQuery = `
    SELECT * FROM Places WHERE owner_id = ?
  `;
  return new Promise((resolve, reject) => {
    db.query(selectPlacesQuery, [ownerId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};
async function getPlaceById(id) {
  return new Promise((resolve, reject) => {
    // Replace 'places' with the actual name of your places table in the database
    db.query('SELECT * FROM places WHERE place_id = ?', [id], (err, results) => {
      if (err) {
        reject(err);
      } else {
        if (results.length > 0) {
          const placeData = results[0];
          placeData.checkIn = parseInt(placeData.checkIn);
          placeData.checkOut = parseInt(placeData.checkOut);
          placeData.maxGuests = parseInt(placeData.maxGuests);
          placeData.price = parseInt(placeData.price);
          resolve(placeData);
        } else {
          resolve(null);
        }
      }
    });
  });
}

const getAllPlaces = async () => {
  const selectAllPlacesQuery = `
    SELECT * FROM Places
  `;
  return new Promise((resolve, reject) => {
    db.query(selectAllPlacesQuery, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};




const updatePlace = async (
  place_id,
  title,
  address,
  addedphotos,
  description,
  perks,
  extrainfo,
  checkin,
  checkout,
  maxguests,
  price
) => {
  const updateQuery = `
    UPDATE Places
    SET 
      title = ?,
      address = ?,
      photos = ?,
      description = ?,
      perks = ?,
      extraInfo = ?,
      checkIn = ?,
      checkOut = ?,
      maxGuests = ?,
      price=?
    WHERE place_id = ?
  `;
  
  const updateValues = [
    title,
    address,
    JSON.stringify(addedphotos),
    description,
    JSON.stringify(perks),
    extrainfo,
    checkin,
    checkout,
    maxguests,
    price,
    place_id,
  ];

  return new Promise((resolve, reject) => {
    db.query(updateQuery, updateValues, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const findPlacesByAddress = async (searchAddress) => {
  const findPlacesQuery = `
    SELECT * FROM Places WHERE address LIKE ?
  `;
  
  const searchParam = `%${searchAddress}%`;

  return new Promise((resolve, reject) => {
    db.query(findPlacesQuery, [searchParam], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};






const Places = {
  PlaceSchema : createPlaceTable,
  createPlace,
  getAllPlacesByOwner,
  getPlaceById,
  updatePlace,
  getAllPlaces,
  findPlacesByAddress,
};

module.exports = Places ;
