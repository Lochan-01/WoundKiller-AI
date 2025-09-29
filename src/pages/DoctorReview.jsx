import React, { useState } from 'react';
import { User, Calendar, FileText, AlertCircle, CheckCircle, Clock, Star } from 'lucide-react';

const DoctorReview = () => {
  const [selectedReview, setSelectedReview] = useState(null);
  
  const reviews = [
    {
      id: 1,
      date: '2024-01-15',
      doctor: 'Dr. Sarah Johnson',
      specialty: 'Wound Care Specialist',
      status: 'completed',
      priority: 'normal',
      photos: 3,
      notes: 'Patient showing excellent progress. Wound healing at 85% with no signs of infection. Continue current treatment protocol.',
      recommendations: [
        'Continue daily wound cleaning routine',
        'Apply prescribed antibiotic ointment twice daily',
        'Schedule follow-up in 1 week',
        'Monitor for any changes in color or discharge'
      ],
      rating: 5
    },
    {
      id: 2,
      date: '2024-01-12',
      doctor: 'Dr. Michael Chen',
      specialty: 'General Surgery',
      status: 'pending',
      priority: 'high',
      photos: 2,
      notes: 'Review requested for post-surgical wound assessment. Patient reports mild discomfort.',
      recommendations: [],
      rating: null
    },
    {
      id: 3,
      date: '2024-01-09',
      doctor: 'Dr. Emily Rodriguez',
      specialty: 'Dermatology',
      status: 'completed',
      priority: 'normal',
      photos: 4,
      notes: 'Burn healing progressing well. Reduced inflammation and improved tissue regeneration observed.',
      recommendations: [
        'Continue moisturizing routine',
        'Avoid direct sunlight on affected area',
        'Use silicone gel sheets as directed'
      ],
      rating: 4
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'urgent': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'urgent': return <AlertCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'normal': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Doctor Reviews</h1>
        <p className="text-gray-600">View professional medical assessments and recommendations from healthcare providers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {reviews.map((review) => (
            <div 
              key={review.id} 
              className={`bg-white rounded-xl p-6 border-l-4 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer ${
                getPriorityColor(review.priority)
              } ${
                selectedReview?.id === review.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedReview(review)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{review.doctor}</h3>
                    <p className="text-sm text-gray-600">{review.specialty}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${
                    getStatusColor(review.status)
                  }`}>
                    {getStatusIcon(review.status)}
                    <span className="capitalize">{review.status}</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    {new Date(review.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{review.photos} photos reviewed</span>
                </div>
              </div>

              <p className="text-gray-700 text-sm mb-4 line-clamp-2">{review.notes}</p>

              {review.rating && (
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${
                        i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                      }`} 
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">({review.rating}/5)</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {selectedReview ? (
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Review Details</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Doctor's Notes</h3>
                  <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">
                    {selectedReview.notes}
                  </p>
                </div>

                {selectedReview.recommendations.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Recommendations</h3>
                    <ul className="space-y-2">
                      {selectedReview.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Review Date:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(selectedReview.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-gray-600">Photos Reviewed:</span>
                    <span className="font-medium text-gray-900">{selectedReview.photos}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-gray-600">Priority:</span>
                    <span className={`font-medium capitalize ${
                      selectedReview.priority === 'high' ? 'text-red-600' :
                      selectedReview.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {selectedReview.priority}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="font-medium text-gray-900 mb-2">Select a Review</h3>
              <p className="text-gray-600 text-sm">Click on a review to view detailed notes and recommendations.</p>
            </div>
          )}

          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">Need Urgent Review?</h3>
            <p className="text-blue-700 text-sm mb-4">
              If you have concerns about your wound or notice any changes, request an urgent review.
            </p>
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Request Urgent Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorReview;