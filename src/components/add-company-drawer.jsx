import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useFetch from "@/hooks/use-fetch";
import { addNewCompany } from "@/api/apiCompanies";
import { BarLoader } from "react-spinners";
import { useEffect, useState } from "react";
import { PlusCircle } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, { message: "Company name is required" }),
  logo: z
    .any()
    .refine(
      (file) =>
        file[0] &&
        (file[0].type === "image/png" || file[0].type === "image/jpeg"),
      {
        message: "Only PNG or JPEG images are allowed",
      }
    ),
});

const AddCompanyDrawer = ({ fetchCompanies, companies }) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingAddCompany,
    error: errorAddCompany,
    data: dataAddCompany,
    fn: fnAddCompany,
  } = useFetch(addNewCompany);

  const onSubmit = async (data) => {
    const companyExists = companies.some(
      (company) => company.name.toLowerCase() === data.name.toLowerCase()
    );

    if (companyExists) {
      setError("name", {
        type: "manual",
        message: "Company already exists",
      });
      return;
    }

    await fnAddCompany({
      ...data,
      logo: data.logo[0],
    });
  };

  useEffect(() => {
    if (dataAddCompany?.length > 0) {
      fetchCompanies();
      setIsOpen(false);
      reset();
    }
  }, [dataAddCompany, fetchCompanies, reset]);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="flex-shrink-0 w-10 h-10"
        >
          <PlusCircle className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="w-[90%] sm:w-[400px] mx-auto">
        <DrawerHeader>
          <DrawerTitle className="text-lg sm:text-xl font-semibold">
            Add a New Company
          </DrawerTitle>
        </DrawerHeader>
        <form className="flex flex-col gap-4 p-4">
          <div className="space-y-2">
            <Input
              placeholder="Company name"
              {...register("name")}
              className="w-full text-base p-6"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Input
              type="file"
              accept="image/png,image/jpeg"
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold hover:file:bg-violet-100 w-full cursor-pointer"
              {...register("logo")}
            />
            {errors.logo && (
              <p className="text-red-500 text-sm">{errors.logo.message}</p>
            )}
          </div>

          {errorAddCompany?.message && (
            <p className="text-red-500 text-sm">{errorAddCompany?.message}</p>
          )}
          {loadingAddCompany && <BarLoader width={"100%"} color="#36d7b7" />}

          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            variant="blue"
            className="w-full"
            disabled={loadingAddCompany}
          >
            Add Company
          </Button>
        </form>
        <DrawerFooter className="sm:flex-row gap-2">
          <DrawerClose asChild>
            <Button type="button" variant="outline" className="w-full">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AddCompanyDrawer;
