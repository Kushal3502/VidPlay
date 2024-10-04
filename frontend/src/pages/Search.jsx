import { Videos } from "@/components";
import React from "react";
import { useSearchParams } from "react-router-dom";

function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  console.log(query);

  return (
    <div className=" p-4 sm:p-6 lg:px-12">
      <h2 className="lg:text-3xl mb-4">Search results for {query}</h2>
      <div>
        <Videos query={query} />
      </div>
    </div>
  );
}

export default Search;
