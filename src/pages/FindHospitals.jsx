import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, Star, Navigation, Search, Locate, AlertCircle, Ambulance, Stethoscope } from 'lucide-react';

const HospitalFinder = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hospitals, setHospitals] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [sortBy, setSortBy] = useState('distance');

  // Comprehensive hospital database with real coordinates
  const hospitalDatabase = [
    {
      id: 1,
      name: 'Apollo BGS Hospitals Mysore',
      specialty: 'Multi-Specialty',
      phone: '+91-821-2522222',
      address: '154/11, Adichunchanagiri Road, Kuvempu Nagara, Mysuru, Karnataka 570023',
      hours: 'Open 24/7',
      emergencyRoom: true,
      woundCare: true,
      icu: true,
      ambulance: true,
      coordinates: { lat: 12.3105, lng: 76.6483 }, // Mysore coordinates
      rating: 4.7,
      waitTime: '15-30 mins'
    },
    {
      id: 2,
      name: 'Manipal Hospital Mysore',
      specialty: 'Multi-Specialty',
      phone: '+91-821-2522222',
      address: 'Bangalore-Mysore Ring Road, Mandi Mohalla, Mysuru, Karnataka 570015',
      hours: 'Open 24/7',
      emergencyRoom: true,
      woundCare: true,
      icu: true,
      ambulance: true,
      coordinates: { lat: 12.3089, lng: 76.6528 },
      rating: 4.6,
      waitTime: '20-40 mins'
    },
    {
      id: 3,
      name: 'Cauvery Heart and Multi-Speciality Hospital',
      specialty: 'Multi-Specialty',
      phone: '+91-821-2444444',
      address: 'Malavalli-Mysuru Road, Near Teresian College, Mysuru, Karnataka 570028',
      hours: 'Open 24/7',
      emergencyRoom: true,
      woundCare: true,
      icu: true,
      ambulance: true,
      coordinates: { lat: 12.2956, lng: 76.6392 },
      rating: 4.5,
      waitTime: '25-45 mins'
    },
    {
      id: 4,
      name: 'Narayana Hospital Mysore',
      specialty: 'Cardiac Care',
      phone: '+91-821-7102222',
      address: '3rd Phase, Devanur, 2nd Stage, R.S. Naidu Nagar, Mysuru, Karnataka 570019',
      hours: 'Open 24/7',
      emergencyRoom: true,
      woundCare: true,
      icu: true,
      ambulance: true,
      coordinates: { lat: 12.3178, lng: 76.6612 },
      rating: 4.4,
      waitTime: '30-50 mins'
    },
    {
      id: 5,
      name: 'Columbia Asia Hospital Mysore',
      specialty: 'Multi-Specialty',
      phone: '+91-821-6199999',
      address: 'FT-4, 5th Main Road, Vijaynagar 2nd Stage, Mysuru, Karnataka 570017',
      hours: 'Open 24/7',
      emergencyRoom: true,
      woundCare: true,
      icu: true,
      ambulance: true,
      coordinates: { lat: 12.3214, lng: 76.6543 },
      rating: 4.3,
      waitTime: '10-25 mins'
    },
    {
      id: 6,
      name: 'JSS Hospital Mysore',
      specialty: 'Super Specialty',
      phone: '+91-821-2548400',
      address: 'Bannimantap, Mysuru, Karnataka 570015',
      hours: 'Open 24/7',
      emergencyRoom: true,
      woundCare: true,
      icu: true,
      ambulance: true,
      coordinates: { lat: 12.2997, lng: 76.6395 },
      rating: 4.8,
      waitTime: '15-35 mins'
    },
    {
      id: 7,
      name: 'K.R. Hospital Mysore',
      specialty: 'Government Hospital',
      phone: '+91-821-2423000',
      address: 'New Kantharaj Urs Road, Mysuru, Karnataka 570001',
      hours: 'Open 24/7',
      emergencyRoom: true,
      woundCare: true,
      icu: true,
      ambulance: true,
      coordinates: { lat: 12.3076, lng: 76.6494 },
      rating: 4.2,
      waitTime: '45-60 mins'
    },
    {
      id: 8,
      name: 'Mysore Medical College & Research Institute',
      specialty: 'Teaching Hospital',
      phone: '+91-821-2520512',
      address: 'Irwin Road, Mysuru, Karnataka 570001',
      hours: 'Open 24/7',
      emergencyRoom: true,
      woundCare: true,
      icu: true,
      ambulance: true,
      coordinates: { lat: 12.3062, lng: 76.6478 },
      rating: 4.1,
      waitTime: '40-70 mins'
    },
    {
      id: 9,
      name: 'Siddhartha Hospital Mysore',
      specialty: 'General Medicine',
      phone: '+91-821-2490444',
      address: 'Hunsur Road, Mysuru, Karnataka 570008',
      hours: 'Open 24/7',
      emergencyRoom: true,
      woundCare: true,
      icu: true,
      ambulance: true,
      coordinates: { lat: 12.2845, lng: 76.6273 },
      rating: 4.0,
      waitTime: '20-40 mins'
    }
  ];

  const specialties = [
    { value: 'all', label: 'All Specialties' },
    { value: 'multi-specialty', label: 'Multi-Specialty' },
    { value: 'cardiac', label: 'Cardiac Care' },
    { value: 'general', label: 'General Medicine' },
    { value: 'super-specialty', label: 'Super Specialty' },
    { value: 'trauma', label: 'Trauma Center' }
  ];

  const sortOptions = [
    { value: 'distance', label: 'Nearest First' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'name', label: 'Alphabetical' }
  ];

  // Calculate distance using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Get user's current location
  const getUserLocation = () => {
    setIsLoading(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ 
          lat: latitude, 
          lng: longitude,
          timestamp: new Date().toLocaleTimeString()
        });
        setIsLoading(false);
        
        // Show success notification
        console.log('Location accessed successfully:', { latitude, longitude });
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable. Please check your connection.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.';
            break;
          default:
            errorMessage = 'An unknown error occurred while accessing location.';
        }
        setLocationError(errorMessage);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000
      }
    );
  };

  // Process and sort hospitals based on user location
  useEffect(() => {
    let processedHospitals = hospitalDatabase.map(hospital => {
      let distance = null;
      let displayDistance = 'Location required';
      
      if (userLocation) {
        distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          hospital.coordinates.lat,
          hospital.coordinates.lng
        );
        
        // Format distance appropriately
        if (distance < 1) {
          displayDistance = `${Math.round(distance * 1000)} m`;
        } else {
          displayDistance = `${distance.toFixed(1)} km`;
        }
      }

      return {
        ...hospital,
        distance,
        displayDistance,
        rawDistance: distance || Infinity
      };
    });

    // Sort hospitals
    processedHospitals.sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return a.rawDistance - b.rawDistance;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return a.rawDistance - b.rawDistance;
      }
    });

    setHospitals(processedHospitals);
  }, [userLocation, sortBy]);

  // Auto-detect location on component mount
  useEffect(() => {
    getUserLocation();
  }, []);

  // Filter hospitals based on search and specialty
  const filteredHospitals = hospitals.filter(hospital => {
    const matchesSearch = hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         hospital.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         hospital.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSpecialty = selectedSpecialty === 'all' ||
                           hospital.specialty.toLowerCase().includes(selectedSpecialty.replace('-', ' '));

    return matchesSearch && matchesSpecialty;
  });

  // Generate directions URL
  const getDirectionsUrl = (hospital) => {
    if (userLocation) {
      return `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${hospital.coordinates.lat},${hospital.coordinates.lng}`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.address)}`;
  };

  // Generate call URL
  const getCallUrl = (phone) => {
    return `tel:${phone.replace(/[^0-9+]/g, '')}`;
  };

  // Open hospital in maps
  const openMaps = (hospital) => {
    window.open(getDirectionsUrl(hospital), '_blank', 'noopener,noreferrer');
  };

  // Emergency call function
  const makeEmergencyCall = (number) => {
    if (confirm(`Call ${number}?`)) {
      window.location.href = `tel:${number}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-6">
          <div className="flex items-center justify-center mb-4">
            <Stethoscope className="w-12 h-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Hospital Finder</h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Find nearby hospitals and healthcare facilities using your device's location
          </p>
        </div>

        {/* Location Status Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Locate className="w-8 h-8 text-blue-600 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Your Location</h3>
                {userLocation ? (
                  <p className="text-green-600">
                    Detected at {userLocation.timestamp} • 
                    Lat: {userLocation.lat.toFixed(4)}, Lng: {userLocation.lng.toFixed(4)}
                  </p>
                ) : locationError ? (
                  <p className="text-red-600">{locationError}</p>
                ) : (
                  <p className="text-gray-600">Detecting your location...</p>
                )}
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={getUserLocation}
                disabled={isLoading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors flex items-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Detecting...
                  </>
                ) : (
                  <>
                    <Locate className="w-4 h-4 mr-2" />
                    {userLocation ? 'Refresh' : 'Find Me'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search hospitals, specialties, or addresses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Specialty Filter */}
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {specialties.map((specialty) => (
                <option key={specialty.value} value={specialty.value}>
                  {specialty.label}
                </option>
              ))}
            </select>
            
            {/* Sort Options */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {filteredHospitals.map((hospital) => (
            <div key={hospital.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              {/* Hospital Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-900 leading-tight">{hospital.name}</h3>
                  <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
                    <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                    <span className="text-sm font-semibold">{hospital.rating}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                    {hospital.specialty}
                  </span>
                  <span className={`text-sm font-semibold ${
                    hospital.distance < 5 ? 'text-green-600' : 
                    hospital.distance < 10 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    <Navigation className="w-4 h-4 inline mr-1" />
                    {hospital.displayDistance}
                  </span>
                </div>
              </div>

              {/* Hospital Details */}
              <div className="p-6">
                <div className="space-y-3 mb-4">
                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 text-gray-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 text-sm leading-relaxed">{hospital.address}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-gray-500 mr-3" />
                    <span className="text-gray-700 text-sm">{hospital.phone}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-gray-500 mr-3" />
                    <span className="text-gray-700 text-sm">{hospital.hours}</span>
                  </div>
                </div>

                {/* Services Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {hospital.emergencyRoom && (
                    <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                      <Ambulance className="w-3 h-3 mr-1" />
                      Emergency
                    </span>
                  )}
                  {hospital.woundCare && (
                    <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                      Wound Care
                    </span>
                  )}
                  {hospital.icu && (
                    <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">
                      ICU Available
                    </span>
                  )}
                  {hospital.ambulance && (
                    <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded">
                      Ambulance
                    </span>
                  )}
                </div>

                {/* Wait Time */}
                <div className="mb-4">
                  <span className="text-xs text-gray-500">Estimated wait time: </span>
                  <span className="text-sm font-medium text-gray-700">{hospital.waitTime}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => openMaps(hospital)}
                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Directions
                  </button>
                  
                  <a
                    href={getCallUrl(hospital.phone)}
                    className="bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredHospitals.length === 0 && !isLoading && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No hospitals found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria or check your location access.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedSpecialty('all'); }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Emergency Section */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-red-800 mb-2 flex items-center">
                <Ambulance className="w-6 h-6 mr-2" />
                Emergency Services
              </h3>
              <p className="text-red-700">
                For life-threatening emergencies, call immediately. Don't wait for an appointment.
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => makeEmergencyCall('911')}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Call 911 (US)
              </button>
              <button
                onClick={() => makeEmergencyCall('108')}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Call 108 (India)
              </button>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center text-gray-500 text-sm mb-8">
          <p>📍 Using device location to find the nearest hospitals • 🔄 Refresh to update your location</p>
          <p className="mt-2">Data is simulated for demonstration purposes</p>
        </div>
      </div>
    </div>
  );
};

export default HospitalFinder;