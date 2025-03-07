"use client";

import { useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import { loginValidation } from "../../utils/authValidations";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Input, Error, OverlayLoading } from "../../components";

function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient();

  const initialValues = {
    email: "",
    password: "",
  };

  // Check if there is a user
  useLayoutEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data.session) {
        router.push("/");
      }
    };

    getUser();
  }, []);

  const onSubmit = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      setLoading(false);
      if (error?.message) {
        toast.error(error.message);
      } else {
        router.push("/");
        toast.success("Login Successfully!");
      }
    } catch (error) {
      toast.error("Something went wrong. Try Again!");
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: loginValidation,
    onSubmit,
  });

  const { handleChange, handleBlur, handleSubmit, values, errors } = formik;

  return (
    <>
      {loading && <OverlayLoading />}
      <div className="flex min-h-screen flex-1">
        <div className="min-h-screen flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto h-full w-full flex flex-1 flex-col justify-center max-w-sm lg:w-96">
            <img
              className="h-auto w-[220px] -ml-4"
              src="/logo.png"
              alt="logo"
            />
            <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign in to your account
            </h2>

            <div className="mt-10">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Username or Email
                  </label>
                  <div className="mt-2">
                    <Input
                      type="email"
                      name="email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                      isError={errors.email && formik.touched.email}
                    />
                    {errors.email && formik.touched.email && (
                      <Error value={errors.email} />
                    )}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Password
                  </label>
                  <div className="mt-2">
                    <Input
                      type="password"
                      name="password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                      isError={errors.password && formik.touched.password}
                    />
                    {errors.password && formik.touched.password && (
                      <Error value={errors.password} />
                    )}
                  </div>
                </div>

                <div className="!mt-10">
                  <button type="submit" className="buttonPrimary">
                    Sign in
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 relative hidden w-0 flex-1 lg:block">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src="/login-poster.jpg"
            alt=""
          />
        </div>
      </div>
    </>
  );
}

export default LoginForm;
