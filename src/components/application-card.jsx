/* eslint-disable react/prop-types */
import { Boxes, BriefcaseBusiness, Download, School } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "./ui/select";
import { updateApplicationStatus } from "@/api/apiApplication";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";

const ApplicationCard = ({ application, isCandidate = false }) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = application?.resume;
    link.target = "_blank";
    link.click();
  };

  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateApplicationStatus,
    {
      job_id: application.job_id,
    }
  );

  const handleStatusChange = (status) => {
    fnHiringStatus(status).then(() => fnHiringStatus());
  };

  return (
    <Card className="w-full">
      {loadingHiringStatus && <BarLoader width={"100%"} color="#36d7b7" />}
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <span className="text-lg sm:text-xl font-bold line-clamp-2">
            {isCandidate
              ? `${application?.job?.title} at ${application?.job?.company?.name}`
              : application?.name}
          </span>
          <Download
            size={18}
            className="bg-white text-black rounded-full h-8 w-8 p-1.5 cursor-pointer flex-shrink-0"
            onClick={handleDownload}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex gap-2 items-center text-sm sm:text-base">
            <BriefcaseBusiness size={15} className="flex-shrink-0" />
            <span>{application?.experience} years of experience</span>
          </div>
          <div className="flex gap-2 items-center text-sm sm:text-base">
            <School size={15} className="flex-shrink-0" />
            <span>{application?.education}</span>
          </div>
          <div className="flex gap-2 items-center text-sm sm:text-base">
            <Boxes size={15} className="flex-shrink-0" />
            <span className="truncate">Skills: {application?.skills}</span>
          </div>
        </div>
        <hr />
        {!isCandidate && (
          <div className="w-full sm:w-1/3">
            <Select
              value={application?.status}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Application Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="reviewing">Reviewing</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApplicationCard;
