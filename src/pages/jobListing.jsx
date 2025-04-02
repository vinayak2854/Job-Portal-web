import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { State } from "country-state-city";
import { BarLoader } from "react-spinners";
import useFetch from "@/hooks/use-fetch";

import JobCard from "@/components/job-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getCompanies } from "@/api/apiCompanies";
import { getJobs } from "@/api/apiJobs";

const JobListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");

  const { isLoaded } = useUser();

  const {
    // loading: loadingCompanies,
    data: companies,
    fn: fnCompanies,
  } = useFetch(getCompanies);

  const {
    loading: loadingJobs,
    data: jobs,
    fn: fnJobs,
  } = useFetch(getJobs, {
    location,
    company_id,
    searchQuery,
  });

  useEffect(() => {
    if (isLoaded) {
      fnCompanies();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded) fnJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, location, company_id, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);

    const query = formData.get("search-query");
    if (query) setSearchQuery(query);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCompany_id("");
    setLocation("");
  };

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="px-4 sm:px-0">
      <h1 className="gradient-title font-extrabold text-4xl sm:text-6xl lg:text-7xl text-center pb-8">
        Latest Jobs
      </h1>
      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row w-full gap-2 sm:gap-4 mb-4"
      >
        <Input
          type="text"
          placeholder="Search Jobs by Title.."
          name="search-query"
          className="flex-1 text-base sm:text-lg p-6"
        />
        <Button type="submit" className="w-full sm:w-auto" variant="blue">
          Search
        </Button>
      </form>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
        <div className="w-full sm:w-1/3">
          <Select
            value={location}
            onValueChange={(value) => setLocation(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {State.getStatesOfCountry("IN").map(({ name }) => {
                  return (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-1/3">
          <Select
            value={company_id}
            onValueChange={(value) => setCompany_id(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by Company" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {companies?.map(({ name, id }) => {
                  return (
                    <SelectItem key={name} value={id}>
                      {name}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Button
          className="w-full sm:w-1/3"
          variant="destructive"
          onClick={clearFilters}
        >
          Clear Filters
        </Button>
      </div>

      {loadingJobs && (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      )}

      {loadingJobs === false && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs?.length ? (
            jobs.map((job) => {
              return (
                <JobCard
                  key={job.id}
                  job={job}
                  savedInit={job?.saved?.length > 0}
                />
              );
            })
          ) : (
            <div className="text-center col-span-full text-lg sm:text-xl">
              No Jobs Found 😢
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobListing;
