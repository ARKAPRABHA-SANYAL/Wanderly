import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function IndexPage() {
  const [places, setPlaces] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      const response = await axios.get('/places');
      setPlaces(response.data);
    } catch (error) {
      console.error('Error fetching places:', error);
    }
  };

  const handleSearch = async () => {
    try {
      if (searchQuery.trim() === '') {
        setSearchResults([]);
        return;
      }

      const response = await axios.get(`/search?query=${searchQuery}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching for places:', error);
    }
  };

  const displayPlaces = searchQuery.trim() === '' ? places : searchResults;

  return (
    <div>
      <div className="flex justify-center mt-4">
        <input
          type="text"
          placeholder="Search by location"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyUp={handleSearch}
          className="border border-gray-300 rounded p-2"
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 gap-y-8 mt-8">
        {displayPlaces.length > 0 ? (
          displayPlaces.map((place) => (
            <Link to={'/place/' + place.place_id} key={place.place_id}>
              <div className="bg-gray-500 rounded-2xl flex">
                {place.photos?.[0] && (
                  <img
                    className="rounded-2xl object-cover aspect-square"
                    src={'http://localhost:4000/uploads/' + JSON.parse(place.photos)?.[0]}
                    alt=""
                  />
                )}
              </div>
              <h2 className="text-sm mt-2 font-semibold truncate">{place.address}</h2>
              <h3 className="text-sm truncate">{place.title}</h3>
              <div className="mt-1">
                <span className="font-semibold">₹ {place.price}</span>
                {" "}per night
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center mt-4">
            {searchQuery.trim() === '' ? 'Loading places...' : 'No results found.'}
          </div>
        )}
      </div>
    </div>
  );
}
