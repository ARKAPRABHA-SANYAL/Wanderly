export default function PlaceImg({ place, index = 0, className = null }) {
    // Check if place is not defined or does not have a 'photos' property
    if (!place || !(place.photos)?.length) {
      return null; // Return null if place is not defined or photos is empty
    }
  
    // If className is not provided, set it to 'object-cover'
    if (!className) {
      className = 'object-cover';
    }
  
    const photosArray = JSON.parse(place.photos);
  
    // Check if the photosArray is valid and has the given index
    if (!Array.isArray(photosArray) || index >= photosArray.length) {
      return null; // Return null if photosArray is invalid or index is out of bounds
    }
  
    return (
      <img
        className={className}
        src={'http://localhost:4000/uploads/' + photosArray[index]}
        alt=""
      />
    );
  }
  