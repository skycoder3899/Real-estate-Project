import React from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faEdit,
  faHeart,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

const Card = ({
  property,
  onInterestedClick,
  onLikeClick,
  onDelete,
  onEdit,
}) => {
  const location = useLocation().pathname;
  property.bedrooms = property.attribute.bedrooms;
  property.bathrooms = property.attribute.bathrooms;
  property.nearbyHospitals = property.attribute.nearbyHospitals;
  property.nearbyColleges = property.attribute.nearbyColleges;
  return (
    <div className="w-80 rounded overflow-hidden shadow-lg m-4">
      <div className="relative">
        <img
          className="w-full h-56 object-cover object-center"
          src={property?.image || "https://picsum.photos/300"}
          alt={property.title}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-transparent to-transparent p-4 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-white w-3/4">
            {property.title}
          </h2>
          <p className="text-lg text-gray-300 w-1/4 text-right">
            <strong>₹{property.price / 100000}L</strong>
          </p>
        </div>
      </div>
      <div className="p-4">
        <p className="text-gray-700 mt-2 line-clamp-3 w-full">
          {property.description}
        </p>
        <div className="mt-4 space-y-2 w-full">
          <p className="text-gray-600 w-full">
            <span className="font-semibold">Place:</span>{" "}
            <span className="truncate">{property.place}</span>
          </p>
          <p className="text-gray-600 w-full">
            <span className="font-semibold">Acre:</span> {property.area}
          </p>
          <div className="flex justify-between w-full">
            <div className="w-1/2">
              <p className="text-gray-600 truncate">
                <span className="font-semibold">Bedrooms:</span>{" "}
                {property.attribute.bedrooms}
              </p>
            </div>
            <div className="w-1/2">
              <p className="text-gray-600 truncate">
                <span className="font-semibold">Bathrooms:</span>{" "}
                {property.attribute.bathrooms}
              </p>
            </div>
          </div>
          <p className="text-gray-600 w-full">
            <span className="font-semibold">Nearby Hospital:</span>{" "}
            <span className="truncate">
              {property.attribute.nearbyHospitals}
            </span>
          </p>
          <p className="text-gray-600 w-full">
            <span className="font-semibold">Nearby College:</span>{" "}
            <span className="truncate">
              {property.attribute.nearbyColleges}
            </span>
          </p>
        </div>

        {location === "/" && (
          <div className="flex mt-6 space-x-4">
            <button
              onClick={() => onLikeClick(property)}
              className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <FontAwesomeIcon icon={faHeart} className="mr-1" />
              Like ({property.likesCount})
            </button>
            <button
              onClick={() => onInterestedClick(property)}
              className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Interest
            </button>
          </div>
        )}
        {location === "/seller" && (
          <div className="flex mt-6 space-x-4">
            <button
              onClick={() => onEdit(property)}
              className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <FontAwesomeIcon icon={faEdit} className="mr-1" />
            </button>
            <button
              onClick={() => onDelete(property._id)}
              className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <FontAwesomeIcon icon={faTrash} className="mr-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default Card;
