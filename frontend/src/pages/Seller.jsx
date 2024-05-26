import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import CreatePropertyModal from '../components/CreatePropertyModal';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus
} from "@fortawesome/free-solid-svg-icons";

const Seller = () => {
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { currentUser,accessToken } = useSelector((state) => state.user);

  useEffect(() => {
    if(currentUser.role==="buyer") navigate("/");
    const fetchProperties = async () => {
      try {
        const res = await fetch('api/v1/seller', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        const response = await res.json();
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };
    fetchProperties();
  }, []);

  const handleInterestedClick = (property) => {
    setSelectedProperty(property);
  };

  const handleCreateProperty = async (newProperty) => {
    try {
      const res = await fetch('api/v1/seller/add', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProperty),
      });
      if (res.ok) {
        const createdProperty = await res.json();
        const data= {
          "_id": createdProperty.data.savedProperty._id,
          "userId": createdProperty.data.savedProperty.userId,
          "title": createdProperty.data.savedProperty.title,
          "description": createdProperty.data.savedProperty.description,
          "place": createdProperty.data.savedProperty.place,
          "area": createdProperty.data.savedProperty.area,
          "price": createdProperty.data.savedProperty.price,
          "createdAt": createdProperty.data.savedProperty.createdAt,
          "updatedAt": createdProperty.data.savedProperty.updatedAt,
          "__v": 0,
          "attribute": {
              "_id": createdProperty.data.savedAttributes._id,
              "propertyId":createdProperty.data.savedProperty._id ,
              "bedrooms": createdProperty.data.savedAttributes.bedrooms,
              "bathrooms": createdProperty.data.savedAttributes.bathrooms,
              "nearbyHospitals": createdProperty.data.savedAttributes.nearbyHospitals,
              "nearbyColleges": createdProperty.data.savedAttributes.nearbyColleges,
              "__v": 0
          }
      }
        setProperties([...properties,data]);
        setIsCreateModalOpen(false);
      }
    } catch (error) {
      console.error('Error creating property:', error);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    try {
      const res = await fetch(`api/v1/seller/${propertyId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        setProperties(properties.filter(property => property._id !== propertyId));
      }
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  const handleEditProperty = (property) => {
    setSelectedProperty(property);
    setIsCreateModalOpen(true);
  };

  const handleUpdateProperty = async (updatedProperty) => {
    try {
      const res = await fetch(`api/v1/seller/${updatedProperty._id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProperty),
      });
      
      if (res.ok) {
        const createdProperty = await res.json();
        const data= {
          "_id": createdProperty.data.updatedProperty._id,
          "userId": createdProperty.data.updatedProperty.userId,
          "title": createdProperty.data.updatedProperty.title,
          "description": createdProperty.data.updatedProperty.description,
          "place": createdProperty.data.updatedProperty.place,
          "area": createdProperty.data.updatedProperty.area,
          "price": createdProperty.data.updatedProperty.price,
          "createdAt": createdProperty.data.updatedProperty.createdAt,
          "updatedAt": createdProperty.data.updatedProperty.updatedAt,
          "__v": 0,
          "attribute": {
              "_id": createdProperty.data.updatedAttributes._id,
              "propertyId":createdProperty.data.updatedProperty._id ,
              "bedrooms": createdProperty.data.updatedAttributes.bedrooms,
              "bathrooms": createdProperty.data.updatedAttributes.bathrooms,
              "nearbyHospitals": createdProperty.data.updatedAttributes.nearbyHospitals,
              "nearbyColleges": createdProperty.data.updatedAttributes.nearbyColleges,
              "__v": 0
          }
      }
        setProperties(properties.map(property => property._id === updatedProperty._id ? data : property));
        setIsCreateModalOpen(false);
      }
    } catch (error) {
      console.error('Error updating property:', error);
    }
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setSelectedProperty(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Properties</h1>
      <div className="flex justify-between mb-4">
        <div></div> 
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        ><FontAwesomeIcon icon={faCirclePlus} className="mr-1"/> Add
        </button>
      </div>
      <div className="flex flex-wrap">
        {properties.map((property, index) => (
          <Card
            key={index}
            property={property}
            onInterestedClick={handleInterestedClick}
            onLikeClick={() => {}} // Like functionality can be implemented as needed
            onDelete={handleDeleteProperty}
            onEdit={handleEditProperty}
          />
        ))}
      </div>
      {isCreateModalOpen && (
        <CreatePropertyModal
          onClose={handleCloseCreateModal}
          onCreate={selectedProperty ? handleUpdateProperty : handleCreateProperty}
          property={selectedProperty}
        />
      )}
    </div>
  );
};

export default Seller;
