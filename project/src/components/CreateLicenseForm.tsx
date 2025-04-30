import React, { useState } from 'react';
import { useLicenses } from '../context/LicenseContext';
import { ContentType } from '../types';

interface CreateLicenseFormProps {
  onClose: () => void;
}

const CreateLicenseForm: React.FC<CreateLicenseFormProps> = ({ onClose }) => {
  const { addLicense } = useLicenses();
  
  const [formData, setFormData] = useState({
    name: '',
    contentId: `content-${Date.now()}`,
    contentType: 'video' as ContentType,
    contentName: '',
    issuedTo: '',
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    isActive: true,
    usageLimit: 0,
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'usageLimit') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert date string to timestamp
    const expiresAt = new Date(formData.expiresAt).getTime();
    
    // Add new license
    addLicense({
      ...formData,
      expiresAt,
      usageLimit: formData.usageLimit > 0 ? formData.usageLimit : undefined,
    });
    
    onClose();
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
            License Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Premium Movie License"
          />
        </div>
        
        <div>
          <label htmlFor="contentName" className="block text-sm font-medium text-gray-300 mb-1">
            Content Name
          </label>
          <input
            type="text"
            id="contentName"
            name="contentName"
            required
            value={formData.contentName}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Blockbuster Movie 2025"
          />
        </div>
        
        <div>
          <label htmlFor="contentType" className="block text-sm font-medium text-gray-300 mb-1">
            Content Type
          </label>
          <select
            id="contentType"
            name="contentType"
            required
            value={formData.contentType}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="video">Video</option>
            <option value="audio">Audio</option>
            <option value="document">Document</option>
            <option value="software">Software</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="issuedTo" className="block text-sm font-medium text-gray-300 mb-1">
            Issued To (Email)
          </label>
          <input
            type="email"
            id="issuedTo"
            name="issuedTo"
            required
            value={formData.issuedTo}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="user@example.com"
          />
        </div>
        
        <div>
          <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-300 mb-1">
            Expiration Date
          </label>
          <input
            type="date"
            id="expiresAt"
            name="expiresAt"
            required
            value={formData.expiresAt}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        
        <div>
          <label htmlFor="usageLimit" className="block text-sm font-medium text-gray-300 mb-1">
            Usage Limit (0 for unlimited)
          </label>
          <input
            type="number"
            id="usageLimit"
            name="usageLimit"
            min="0"
            value={formData.usageLimit}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="15"
          />
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4 text-emerald-500 focus:ring-emerald-500 border-gray-500 rounded"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-300">
            License Active
          </label>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-md transition-colors"
        >
          Create License
        </button>
      </div>
    </form>
  );
};

export default CreateLicenseForm;