import React from "react";
import SelectionList from "./SelectionList";

const movies = {
  upcoming: {
    apiCall: "upcoming",
    header:
      "Stratégie"
  },
  topRated: {
    apiCall: "top_rated",
    header: "Spécifications"
  },
  action: {
    apiCall: 28,
    header: "Ux/Ui"
  },
  adventure: {
    apiCall: 12,
    header: "Contenus"
  },
  animation: {
    apiCall: 16,
    header: "Front-end"
  },
  comedy: {
    apiCall: 35,
    header: "Architecture"
  },
  crime: {
    apiCall: 80,
    header: "Back-end"
  },
  mystery: {
    apiCall: 878,
    header: "Hebergement"
  }
};

const SelectionPage = () => {
    console.log(movies)
  return (
    <div>
      
      {Object.keys(movies).map((item, i) => (
        <div key={i}>
          <SelectionList heading={movies[item].header} apiCall={movies[item].apiCall} />
        </div>
      ))}
    </div>
  );
};

export default SelectionPage;
