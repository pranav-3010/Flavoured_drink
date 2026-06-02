'use client';

import React from 'react';
import { DeliveryAddress } from '@/types/order';

interface DeliveryAddressFormProps {
  address: DeliveryAddress;
  onChange: (address: DeliveryAddress) => void;
  disabled?: boolean;
}

export function DeliveryAddressForm({
  address,
  onChange,
  disabled = false,
}: DeliveryAddressFormProps) {
  const handleChange = (field: keyof DeliveryAddress, value: string) => {
    onChange({
      ...address,
      [field]: value,
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Delivery Address</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={address.name}
            onChange={(e) => handleChange('name', e.target.value)}
            disabled={disabled}
            placeholder="John Doe"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black disabled:bg-gray-100"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={address.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            disabled={disabled}
            placeholder="+91 98765 43210"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black disabled:bg-gray-100"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address <span className="text-red-500">*</span>
        </label>
        <textarea
          value={address.address}
          onChange={(e) => handleChange('address', e.target.value)}
          disabled={disabled}
          placeholder="123 Main Street, Apartment 4B"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black disabled:bg-gray-100 resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={address.city}
            onChange={(e) => handleChange('city', e.target.value)}
            disabled={disabled}
            placeholder="Mumbai"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black disabled:bg-gray-100"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pin Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={address.pincode}
            onChange={(e) => handleChange('pincode', e.target.value)}
            disabled={disabled}
            placeholder="400001"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black disabled:bg-gray-100"
          />
        </div>
      </div>
    </div>
  );
}
