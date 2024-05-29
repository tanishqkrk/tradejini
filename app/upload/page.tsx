"use client";
import React, { useState } from "react";
import { MarginTypes } from "../(types)/MarginTypes";

const Page: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    // Basic file validation (optional)
    if (!file) {
      setErrorMessage("Please select a file");
      return;
    }

    if (
      file.type !==
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      setErrorMessage("Please select an Excel file (.xlsx)");
      return;
    }

    setSelectedFile(file);
    setErrorMessage(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedFile) {
      setErrorMessage("Please select a file before submitting");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(`/apis/${type}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log("API response:", data); // Handle successful response
      alert("Uploaded the file successfully!");
      setSelectedFile(null); // Clear file selection after successful upload
    } catch (error) {
      console.error("Error uploading file:", error);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const [type, setType] = useState<MarginTypes>("ef");

  return (
    <div className="space-y-10 px-20">
      <div className="flex items-center justify-center gap-12">
        <button
          className={`${
            type === "ef" ? "bg-[#19AC63] text-white" : "text-green-500"
          } rounded-lg p-3 font-semibold transition-all duration-150`}
          onClick={() => {
            setType("ef");
          }}
        >
          Equity Futures
        </button>
        <button
          className={`${
            type === "comm" ? "bg-[#19AC63] text-white" : "text-green-500"
          } rounded-lg p-3 font-semibold transition-all duration-150`}
          onClick={() => {
            setType("comm");
          }}
        >
          Commodity
        </button>
        <button
          className={`${
            type === "curr" ? "bg-[#19AC63] text-white" : "text-green-500"
          } rounded-lg p-3 font-semibold transition-all duration-150`}
          onClick={() => {
            setType("curr");
          }}
        >
          Currency
        </button>
        <button
          className={`${
            type === "eq" ? "bg-[#19AC63] text-white" : "text-green-500"
          } rounded-lg p-3 font-semibold transition-all duration-150`}
          onClick={() => {}}
        >
          Equity
        </button>
      </div>

      <form
        className="flex flex-col items-center gap-y-4"
        onSubmit={handleSubmit}
      >
        <input
          type="file"
          accept=".xlsx"
          name="file"
          className="w-80 rounded-2xl border-2 border-red-500 p-5"
          onChange={handleFileChange}
        />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="disabled:cursor-no w-80 rounded-lg border-2 border-[#19AC63] px-3 py-2 text-[#19AC63] disabled:border-gray-500 disabled:text-gray-500"
        >
          {isLoading ? "Uploading..." : "Upload Excel File"}
        </button>
      </form>
    </div>
  );
};

export default Page;
