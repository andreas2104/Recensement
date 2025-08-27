import React from 'react';

const SkeletonLoading: React.FC = () => {
  return (
    <div className="w-full">
      <div className="h-8 bg-gray-200 rounded mb-4 animate-shimmer"></div>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">
              <div className="h-4 bg-gray-200 rounded animate-shimmer"></div>
            </th>
            <th className="border p-2">
              <div className="h-4 bg-gray-200 rounded animate-shimmer"></div>
            </th>
            <th className="border p-2">
              <div className="h-4 bg-gray-200 rounded animate-shimmer"></div>
            </th>
            <th className="border p-2">
              <div className="h-4 bg-gray-200 rounded animate-shimmer"></div>
            </th>
            <th className="border p-2">
              <div className="h-4 bg-gray-200 rounded animate-shimmer"></div>
            </th>
            <th className="border p-2">
              <div className="h-4 bg-gray-200 rounded animate-shimmer"></div>
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="border p-2">
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-shimmer"></div>
              </td>
              <td className="border p-2">
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-shimmer"></div>
              </td>
              <td className="border p-2">
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-shimmer"></div>
              </td>
              <td className="border p-2">
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-shimmer"></div>
              </td>
              <td className="border p-2">
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-shimmer"></div>
              </td>
              <td className="border p-2">
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-shimmer"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SkeletonLoading;