"use client";
import { jobs } from "@prisma/client";
import { useEffect, useState, useRef } from "react";

export default function List({data}: {data: jobs[]}) {

  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const detailsRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  

  // Reset scroll position when job changes
  useEffect(() => {
    if (detailsRef.current && selectedJob) {
      detailsRef.current.scrollTo(0, 0);
    }
  }, [selectedJob]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-600">
          Loading job listings...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row lg:h-screen gap-4 p-4">
        {/* Job List Column - Always visible */}
        <div className="lg:w-1/2 lg:max-w-xl  flex flex-col">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 lg:mb-6">
            Job Opportunities
          </h1>
        <div className="text-gray-600 mb-4 lg:mb-6">
          <h1>Search
          </h1>
          <input
            type="text"
            className="w-full p-2 rounded-lg border border-gray-300 focus:border-blue-400 focus:outline-none"
            placeholder="Search for jobs"
          />
        </div>
          <div
            className="space-y-3 lg:space-y-4 overflow-auto "
          >
            {data.map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className={`bg-white p-4 rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-all ${
                  selectedJob?.id === job.id
                    ? "border-2 border-blue-400"
                    : "border-2 border-transparent"
                }`}
              >
                <h2 className="text-lg lg:text-xl font-semibold text-gray-800">
                  {job.title}
                </h2>
                {job.employer && (
                  <p className="mt-1 lg:mt-2 text-sm text-gray-600">
                    🏢 {job.employer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Job Details Column - Fixed and scrollable */}
        <div
          className={`flex-1 lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] ${
            selectedJob
              ? "fixed inset-0 lg:relative bg-white lg:bg-transparent p-4 lg:p-0"
              : "hidden lg:block"
          }`}
        >
          {selectedJob && (
            <div
              ref={detailsRef}
              className="h-full lg:h-[calc(100vh-2rem)] bg-white lg:rounded-lg lg:shadow-lg p-4 lg:p-6 overflow-y-auto"
            >
              {/* Mobile back button */}
              <button
                onClick={() => setSelectedJob(null)}
                className="lg:hidden mb-4 text-blue-600 hover:text-blue-700 flex items-center"
              >
                <span className="mr-2">←</span>
                Back to List
              </button>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {selectedJob.title}
              </h2>

              {selectedJob.employer && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Employer
                  </h3>
                  <p className="text-gray-600">🏢 {selectedJob.employer}</p>
                </div>
              )}
              

              {selectedJob.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Description
                  </h3>
                  <div className="text-gray-600 whitespace-pre-wrap space-y-4">
                    {selectedJob.description}
                  </div>
                </div>
              )}

              {selectedJob.links && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Apply Now
                  </h3>
                  <div className="flex flex-col gap-3">
                    {JSON.parse(selectedJob.links).map(
                      (link: string, index: number) => (
                        <a
                          key={index}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center"
                        >
                          Application Portal {index + 1}
                        </a>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Placeholder for desktop */}
          {!selectedJob && (
            <div className="hidden lg:flex items-center justify-center h-full text-gray-400 border-2 border-dashed rounded-lg">
              <p>Select a job to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
