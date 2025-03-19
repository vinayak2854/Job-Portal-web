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

const schema = z.object({
  name: z.string().min(1, { message: "Company name is required" }),
  logo: z
    .any()
    .refine(
      (file) =>
        file[0] &&
        (file[0].type === "image/png" || file[0].type === "image/jpeg"),
      {
        message: "Only Images are allowed",
      }
    ),
});

const AddCompanyDrawer = ({ fetchCompanies, companies }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
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

    fnAddCompany({
      ...data,
      logo: data.logo[0],
    });
  };

  useEffect(() => {
    if (dataAddCompany?.length > 0) {
      fetchCompanies();
    }
  }, [dataAddCompany]);

  return (
    <div className="flex justify-center sm:justify-end">
      <Drawer>
        <DrawerTrigger>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="w-full sm:w-auto"
          >
            Add Company
          </Button>
        </DrawerTrigger>
        <DrawerContent className="w-[90%] sm:w-[400px] mx-auto">
          <DrawerHeader>
            <DrawerTitle className="text-lg sm:text-xl">
              Add a New Company
            </DrawerTitle>
          </DrawerHeader>
          <form className="flex flex-col gap-4 p-4">
            {/* Company Name */}
            <Input placeholder="Company name" {...register("name")} />

            {/* Company Logo */}
            <Input
              type="file"
              accept="image/*"
              className="file:text-gray-500"
              {...register("logo")}
            />

            {/* Add Button */}
            <Button
              type="button"
              onClick={handleSubmit(onSubmit)}
              variant="destructive"
              className="w-full"
            >
              Add
            </Button>
          </form>
          <DrawerFooter className="flex flex-col gap-2 p-4">
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
            {errors.logo && (
              <p className="text-red-500 text-sm">{errors.logo.message}</p>
            )}
            {errorAddCompany?.message && (
              <p className="text-red-500 text-sm">{errorAddCompany?.message}</p>
            )}
            {loadingAddCompany && <BarLoader width={"100%"} color="#36d7b7" />}
            <DrawerClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default AddCompanyDrawer;


