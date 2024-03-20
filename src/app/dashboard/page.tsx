"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import moment from "moment";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  Table,
  OverlayLoading,
  ReactCalendar,
  SpinLoader,
} from "../../components";
import { fetchRso } from "../services/report-service";

const columns = [
  {
    name: "Date",
    selector: (row: any) => (row?.date ? row.date : "-"),
  },
  {
    name: "Hour",
    selector: (row: any) => (row?.hour ? row.hour : "-"),
    sortable: true,
    width: "100px",
  },
  {
    name: "Country Name",
    selector: (row: any) => (row?.country_name ? row.country_name : "-"),
    minWidth: "160px",
  },
  {
    name: "Ad Client ID",
    selector: (row: any) => (row?.ad_client_id ? row.ad_client_id : "-"),
    minWidth: "200px",
    wrap: true,
  },
  {
    name: "Platform Type Code",
    selector: (row: any) =>
      row?.platform_type_code ? row.platform_type_code : "-",
    minWidth: "170px",
  },
  {
    name: "Custom Channel Name",
    selector: (row: any) =>
      row?.custom_channel_name ? row.custom_channel_name : "-",
    minWidth: "200px",
  },
  {
    name: "Ad Requests",
    selector: (row: any) => (row?.ad_requests ? row.ad_requests : "-"),
    sortable: true,
    width: "140px",
  },
  {
    name: "Clicks",
    selector: (row: any) => (row?.clicks ? row.clicks : "-"),
    sortable: true,
    width: "120px",
  },
  {
    name: "Earnings EUR",
    selector: (row: any) => (row?.earnings_eur ? row.earnings_eur : "-"),
    width: "130px",
  },
  {
    name: "Page Views",
    selector: (row: any) => (row?.page_views ? row.page_views : "-"),
    sortable: true,
    width: "130px",
  },
  {
    name: "Individual Ad Impression",
    selector: (row: any) =>
      row?.individual_ad_impressions ? row.individual_ad_impressions : "-",
    sortable: true,
    width: "220px",
  },
  {
    name: "Matched Ad Requests",
    selector: (row: any) =>
      row?.matched_ad_requests ? row.matched_ad_requests : "-",
    width: "200px",
    sortable: true,
  },
  {
    name: "Clicks Spam Ratio",
    selector: (row: any) =>
      row?.clicks_spam_ratio ? row.clicks_spam_ratio : "-",
    width: "160px",
  },
  {
    name: "RPC",
    selector: (row: any) => (row?.rpc ? row.rpc : "-"),
    width: "120px",
  },
  {
    name: "Lander Impressions",
    selector: (row: any) =>
      row?.lander_impressions ? row.lander_impressions : "-",
    width: "170px",
  },
  {
    name: "Lander Clicks",
    selector: (row: any) => (row?.lander_clicks ? row.lander_clicks : "-"),
    width: "150px",
  },
  {
    name: "Lander Requests",
    selector: (row: any) => (row?.lander_clicks ? row.lander_requests : "-"),
    width: "170px",
  },
];

export default function Home() {
  const currentDate = new Date();
  const prevDay = new Date(currentDate);
  prevDay.setDate(currentDate.getDate() - 1);

  const router = useRouter();
  const supabase = createClientComponentClient();

  const [isLoading, setIsLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [startDate, setStartDate] = useState(prevDay);
  const [endDate, setEndDate] = useState(currentDate);
  const [rsoData, setRsoData] = useState<any>([]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetchRso({
        start_date: moment(startDate).format("YYYY-MM-DD"),
        end_date: moment(endDate).format("YYYY-MM-DD"),
      });
      setRsoData((prev: any) => [...prev, ...res]);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setRsoData([]);
    }
  };

  // Check if there is a user
  const getUser = async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      router.push("/login");
    } else {
      fetchData();
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const getFormattedData = () => {
    if (Array.isArray(rsoData) && rsoData?.length > 0) {
      const newArray = rsoData.map((row: any, index: number) => {
        return {
          "Sr #": index + 1,
          Date: row?.date ? row.date : "-",
          Hour: row?.hour ? row.hour : "-",
          "Country Name": row?.country_name ? row.country_name : "-",
          "Ad Client ID": row?.ad_client_id ? row.ad_client_id : "-",
          "Platform Type Code": row?.platform_type_code
            ? row.platform_type_code
            : "-",
          "Custom Channel Name": row?.custom_channel_name
            ? row.custom_channel_name
            : "-",
          "Ad Requests": row?.ad_requests ? row.ad_requests : "-",
          Clicks: row?.clicks ? row.clicks : "-",
          "Earnings EUR": row?.earnings_eur ? row.earnings_eur : "-",
          "Page Views": row?.page_views ? row.page_views : "-",
          "Individual Ad Impression": row?.individual_ad_impressions
            ? row.individual_ad_impressions
            : "-",
          "Matched Ad Requests": row?.matched_ad_requests
            ? row.matched_ad_requests
            : "-",
          "Clicks Spam Ratio": row?.clicks_spam_ratio
            ? row.clicks_spam_ratio
            : "-",
          RPC: row?.rpc ? row.rpc : "-",
          "Lander Impressions": row?.lander_impressions
            ? row.lander_impressions
            : "-",
          "Lander Clicks": row?.lander_clicks ? row.lander_clicks : "-",
          "Lander Requests": row?.lander_clicks ? row.lander_requests : "-",
        };
      });
      return newArray;
    }
  };

  const downloadCSV = (formattedData: any) => {
    var csv = Papa.unparse(formattedData);

    var csvData = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    var csvURL = null;

    if ((window.navigator as any)?.msSaveBlob) {
      csvURL = (window.navigator as any).msSaveBlob(csvData, "RSO Report");
    } else {
      csvURL = window.URL.createObjectURL(csvData);
    }

    var tempLink = document.createElement("a");
    tempLink.href = csvURL;
    tempLink.setAttribute("download", "RSO Report");
    tempLink.click();
  };

  const handleDownloadButton = () => {
    const formattedData = getFormattedData();
    downloadCSV(formattedData);
  };

  const handleSignOut = async () => {
    setLogoutLoading(true);
    await supabase.auth.signOut();
    setLogoutLoading(false);
    router.push("/login");
  };

  return (
    <main className="w-full flex flex-col">
      {isLoading && <OverlayLoading />}
      <div className="w-full margins">
        <div className="w-full flex flex-col">
          <div className="w-full flex items-center mb-5">
            <div className="flex-1 text-2xl sm:text-3xl font-semibold tet-gray-900">
              {rsoData?.length > 0
                ? `${rsoData?.length} Results Found`
                : `Search RSO`}
            </div>
            <button
              className="bg-red-500 px-5 py-2 text-base font-medium text-white rounded-md min-w-[100px] h-[41px] max-w-fit flex items-center justify-center"
              onClick={handleSignOut}
              disabled={logoutLoading}
            >
              {logoutLoading ? (
                <SpinLoader className={"h-4 w-4 border-white"} />
              ) : (
                "Logout"
              )}
            </button>
          </div>
          <div className="w-full flex items-center gap-16 mb-6">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:flex items-center gap-3">
              <div className="w-full flex flex-col gap-1">
                <div className="min-w-fit text-sm font-medium text-gray-900">
                  Start Date:
                </div>
                <div className="w-full">
                  <ReactCalendar
                    date={startDate}
                    setDate={(date: any) => setStartDate(date)}
                  />
                </div>
              </div>
              <div className="w-full flex flex-col gap-1">
                <div className="min-w-fit text-sm font-medium text-gray-900">
                  End Date:
                </div>
                <div className="w-full">
                  <ReactCalendar
                    date={endDate}
                    setDate={(date: any) => setEndDate(date)}
                  />
                </div>
              </div>
              <div className="w-full flex flex-col gap-1">
                <div className="min-w-fit text-sm font-medium text-gray-900 opacity-0 hidden md:block">
                  Search
                </div>
                <button className="buttonPrimary h-[42px]" onClick={fetchData}>
                  Search
                </button>
              </div>
              <div className="w-full flex flex-col gap-1">
                <div className="min-w-fit text-sm font-medium text-gray-900 opacity-0 hidden md:block">
                  Download CSV
                </div>
                <button
                  className="buttonPrimary h-[42px]"
                  onClick={handleDownloadButton}
                >
                  Download CSV
                </button>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col">
            {rsoData?.length > 0 ? (
              <Table
                columns={columns}
                data={rsoData?.length ? rsoData : []}
                pagination={true}
                paginationPerPage={25}
              />
            ) : (
              <div className="w-full flex items-center justify-center text-center py-12 px-6">
                <div className="text-base text-gray-700">Date not found.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
