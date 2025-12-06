'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface FacebookSkeletonProps {
  /**
   * Type de skeleton
   */
  type?: 'post' | 'card' | 'list' | 'profile' | 'custom';
  
  /**
   * Nombre d'éléments
   */
  count?: number;
  
  /**
   * Classe CSS supplémentaire
   */
  className?: string;
}

export const FacebookSkeleton: React.FC<FacebookSkeletonProps> = ({
  type = 'post',
  count = 1,
  className,
}) => {
  const renderSkeleton = (key: number) => {
    switch (type) {
      case 'post':
        return (
          <div key={key} className={cn("bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4", className)}>
            {/* Header du post */}
            <div className="flex items-center mb-4">
              <div className="shimmer h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <div className="ml-3 flex-1">
                <div className="shimmer h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                <div className="shimmer h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
              </div>
            </div>
            
            {/* Contenu du post */}
            <div className="space-y-2 mb-4">
              <div className="shimmer h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="shimmer h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              <div className="shimmer h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
            </div>
            
            {/* Image placeholder */}
            <div className="shimmer h-64 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
            
            {/* Actions */}
            <div className="flex justify-between pt-3 border-t">
              <div className="shimmer h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              <div className="shimmer h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              <div className="shimmer h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            </div>
          </div>
        );

      case 'card':
        return (
          <div key={key} className={cn("bg-white dark:bg-gray-800 rounded-lg shadow p-4", className)}>
            <div className="shimmer h-40 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
            <div className="space-y-3">
              <div className="shimmer h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="shimmer h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="shimmer h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div key={key} className={cn("bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center", className)}>
            <div className="shimmer h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700 mx-auto mb-4"></div>
            <div className="shimmer h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mb-2"></div>
            <div className="shimmer h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto mb-4"></div>
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div>
                <div className="shimmer h-5 bg-gray-200 dark:bg-gray-700 rounded w-8 mx-auto mb-1"></div>
                <div className="shimmer h-3 bg-gray-200 dark:bg-gray-700 rounded w-12 mx-auto"></div>
              </div>
              <div>
                <div className="shimmer h-5 bg-gray-200 dark:bg-gray-700 rounded w-8 mx-auto mb-1"></div>
                <div className="shimmer h-3 bg-gray-200 dark:bg-gray-700 rounded w-12 mx-auto"></div>
              </div>
              <div>
                <div className="shimmer h-5 bg-gray-200 dark:bg-gray-700 rounded w-8 mx-auto mb-1"></div>
                <div className="shimmer h-3 bg-gray-200 dark:bg-gray-700 rounded w-12 mx-auto"></div>
              </div>
            </div>
          </div>
        );

      case 'list':
        return (
          <div key={key} className={cn("space-y-3", className)}>
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                <div className="shimmer h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div className="ml-3 flex-1">
                  <div className="shimmer h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                  <div className="shimmer h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return (
          <div key={key} className={cn("space-y-3", className)}>
            <div className="shimmer h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="shimmer h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            <div className="shimmer h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
          </div>
        );
    }
  };

  return <>{Array.from({ length: count }).map((_, index) => renderSkeleton(index))}</>;
};