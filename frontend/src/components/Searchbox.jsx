import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

function Searchbox({ closeDialog }) {
  const [query, setQuery] = useState();
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    navigate(`/search/?query=${query}`);
    closeDialog();
  };

  return (
    <form
      className="flex flex-wrap justify-center items-center gap-4 w-full lg:w-auto"
      onSubmit={handleSearch}
    >
      <Input
        type="text"
        id="search"
        placeholder="Search for videos"
        className="w-full lg:w-[550px]  px-4 py-2 bg-transparent border-gray-600 text-white text-lg"
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button
        variant="destructive"
        className="w-full lg:w-auto bg-amber-500 hover:bg-amber-600 text-black font-semibold text-base"
        type="submit"
      >
        Search
      </Button>
    </form>
  );
}

export default Searchbox;
