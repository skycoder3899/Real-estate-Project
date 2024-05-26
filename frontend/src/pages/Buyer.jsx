import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Card from "../components/Card";
import SellerDetail from "../components/SellerDetail";
import { useNavigate } from "react-router-dom";
import { faL } from "@fortawesome/free-solid-svg-icons";

const Buyer = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [page, setPage] = useState(1);
  const [isLoading,setIsLoading]=useState(true)
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    place: "",
    area: "",
    bedrooms: "",
    bathrooms: "",
    hospitalsNearby: "",
    collegesNearby: "",
  });

  const navigate = useNavigate();
  const { currentUser, accessToken } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser?.role === "seller") navigate("/seller");
  }, [currentUser, navigate]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProperties();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [filters,page]);

  const fetchProperties = async () => {
    const query = new URLSearchParams({
      page,
      place: filters.place,
      area: filters.area,
      bedrooms: filters.bedrooms,
      bathrooms: filters.bathrooms,
      hospitalsNearby: filters.hospitalsNearby,
      collegesNearby: filters.collegesNearby,
    }).toString();

    try {
      const res = await fetch(`/api/v1/buyer?${query}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await res.json();
      setProperties(response.data.pagPropery.docs);
      setFilteredProperties(response.data.pagPropery.docs);
      setTotalPages(response.data.pagPropery.totalPages);
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  const handleInterestedClick = async (property) => {
    if (currentUser) {
      try {
        const res = await fetch(`/api/v1/buyer/${property._id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        const response = await res.json();
        setSelectedProperty(response.data.user);
      } catch (error) {
        console.error("Error marking property as interested:", error);
      }
    } else {
      navigate("/login");
    }
  };

  const handleLikeClick = async (property) => {
    if (currentUser) {
      try {
        const res = await fetch(`/api/v1/buyer/like/${property._id}`, {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        const response = await res.json();
        if (response) {
          const updatedProperties = properties.map((pro) =>
            pro._id === property._id
              ? {
                  ...pro,
                  likesCount:
                    response.message === "like the property"
                      ? property.likesCount + 1
                      : property.likesCount - 1,
                }
              : pro
          );
          setProperties(updatedProperties);
          setFilteredProperties(updatedProperties);
        }
      } catch (error) {
        console.error("Error liking property:", error);
      }
    } else {
      navigate("/login");
    }
  };

  const handleCloseModal = () => {
    setSelectedProperty(null);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Properties</h1>
      <div className="my-4">
        <h2 className="text-xl font-bold mb-2">Filters</h2>
        <div className="flex flex-wrap">
          <input
            type="text"
            name="place"
            value={filters.place}
            onChange={handleFilterChange}
            placeholder="Place"
            className="mr-2 mb-2 p-2 border rounded"
          />
          <input
            type="number"
            name="area"
            value={filters.area}
            onChange={handleFilterChange}
            placeholder="Under Acre"
            className="mr-2 mb-2 p-2 border rounded"
          />
          <input
            type="number"
            name="bedrooms"
            value={filters.bedrooms}
            onChange={handleFilterChange}
            placeholder="Bedrooms"
            className="mr-2 mb-2 p-2 border rounded"
          />
          <input
            type="number"
            name="bathrooms"
            value={filters.bathrooms}
            onChange={handleFilterChange}
            placeholder="Bathrooms"
            className="mr-2 mb-2 p-2 border rounded"
          />
          <input
            type="text"
            name="hospitalsNearby"
            value={filters.hospitalsNearby}
            onChange={handleFilterChange}
            placeholder="Hospitals Nearby"
            className="mr-2 mb-2 p-2 border rounded"
          />
          <input
            type="text"
            name="collegesNearby"
            value={filters.collegesNearby}
            onChange={handleFilterChange}
            placeholder="Colleges Nearby"
            className="mr-2 mb-2 p-2 border rounded"
          />
        </div>
      </div>
      {isLoading ? (
        <div className="flex flex-wrap">
          {[...Array(10)].map((_, index) => (
            <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
              <div className="animate-pulse bg-gray-200 h-48 rounded-md"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap">
          {filteredProperties.map((property) => (
            <Card
              key={property._id}
              property={property}
              onInterestedClick={handleInterestedClick}
              onLikeClick={handleLikeClick}
            />
          ))}
        </div>
      )}
      {selectedProperty && (
        <SellerDetail
          property={selectedProperty}
          onClose={handleCloseModal}
          userData={selectedProperty}
        />
      )}
      {!isLoading && !(properties.length==0) &&(
        <div className="flex justify-center my-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
            onClick={handlePrevPage}
            disabled={page === 1}
          >
            Previous
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleNextPage}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Buyer;
