import React from 'react';
import {FileSpreadsheet, AlertCircle, Gem } from 'lucide-react';
import FileUpload from '../components/FileUpload';
import { TableData } from '../types';

interface AdminPageProps {
  onDataParsed: (data: TableData[]) => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ onDataParsed }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-8 py-6">
          <div className="flex items-center">
            <Gem className="h-8 w-8 text-white mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-white">Jewelry Import</h1>
              <p className="text-purple-100 mt-1">Upload your CSV or Excel files to import jewellry inventory</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <div className="flex items-start">
                <FileSpreadsheet className="h-6 w-6 text-purple-600 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold text-purple-900 mb-2">Supported Formats</h3>
                  <p className="text-purple-700 text-sm">
                    Upload .CSV or .XLSX files with your jewellry inventory data
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <div className="flex items-start">
                <AlertCircle className="h-6 w-6 text-amber-600 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold text-amber-900 mb-2">Required Columns</h3>
                  <p className="text-amber-700 text-sm">
                    Description, Price, Availability, Image (jewelry photos)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* File Upload Component */}
          <FileUpload onDataParsed={onDataParsed} />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;