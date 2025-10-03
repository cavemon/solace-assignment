"use client";

import {useEffect, useRef, useState} from "react";
import Header from "@/components/header";

export default function Home() {
  const [advocates, setAdvocates] = useState([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef(null);
  const isFiltered = useRef(false);

  useEffect(() => {
    console.log("fetching advocates...");
    getInitialResults();
  }, []);

  const getInitialResults = () => {
    if (advocates.length) {
      setFilteredAdvocates(advocates);
    } else {
      fetch("/api/advocates").then((response) => {
        response.json().then((jsonResponse) => {
          setAdvocates(jsonResponse.data);
          setFilteredAdvocates(jsonResponse.data);
        });
      });
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const search = formData.get('search');

    if (!search) {
      getInitialResults();
    } else {
      await handleSearch(search);
    }
  }

  const handleSearch = async (term: FormDataEntryValue|null) =>{
    const results = await fetch(`/api/search/${term}`).then((response) => {
      response.json().then((jsonResponse) => {
        setFilteredAdvocates(jsonResponse.data);
        setSearchTerm(term);
        isFiltered.current = true;
      });
    });
  }

  const handleReset = () => {
    searchInputRef.current.value = '';
    isFiltered.current = false;
    setSearchTerm('');
    setFilteredAdvocates(advocates);
  };

  return (
    <main style={{ margin: "24px" }}>
      <Header />
      <br />
      <br />
      <div>
        <form onSubmit={handleSubmit} className="search-form">
          <h2 className="search-form__heading">Search</h2>
          <div className="flex justify-between">
            <div>
              <label htmlFor="searchInput" className="sr-only">Search</label>
              <input id="searchInput" ref={searchInputRef} style={{ border: "1px solid black" }} name="search" type="text" />
            </div>
            <button type="submit" className="search-form__submit">Submit</button>

          </div>
          <div className="flex justify-between">
            {searchTerm && (
              <p className="search-form__term">
                Searching for: <span id="search-term">{searchTerm}</span>
              </p>
            )}
            <div>
              {isFiltered.current && (
                <button onClick={handleReset} className="search-form__reset">Reset Search</button>
              )}
            </div>
          </div>

        </form>
      </div>
      <br />
      <br />
      <table className="results-table">
        <thead>
          <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>City</th>
              <th>Degree</th>
              <th>Specialties</th>
              <th>Years of Experience</th>
              <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {filteredAdvocates.map((advocate, index) => {
            return (
              <tr key={`advocate-row-${index}`}>
                <td>{advocate.firstName}</td>
                <td>{advocate.lastName}</td>
                <td>{advocate.city}</td>
                <td>{advocate.degree}</td>
                <td>
                  {advocate.specialties.map((s, childIndex) => (
                    <div key={`advocate-row-${index}-specialties-${childIndex}`}>{s}</div>
                  ))}
                </td>
                <td>{advocate.yearsOfExperience}</td>
                <td>{advocate.phoneNumber}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
