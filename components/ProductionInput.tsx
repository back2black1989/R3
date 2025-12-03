import React from 'react';
import { Package, Box } from 'lucide-react';

interface ProductionInputProps {
  set8: number;
  set2: number;
  onChange: (field: 'set8' | 'set2', value: number) => void;
}

export const ProductionInput: React.FC<ProductionInputProps> = ({ set8, set2, onChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* 8-Piece Set Input */}
      <div className="bg-white rounded-xl shadow-sm border border-purple-100 overflow-hidden">
        <div className="bg-purple-50 p-4 border-b border-purple-100 flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
            <Package size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-purple-900">8片装礼盒 (Plan A)</h3>
            <p className="text-xs text-purple-600">包含: 1盒, 8袋, 16精华, etc.</p>
          </div>
        </div>
        <div className="p-6">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            计划生产数量 (盒)
          </label>
          <input
            type="number"
            min="0"
            value={set8}
            onChange={(e) => onChange('set8', Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full text-3xl font-bold text-gray-800 border-b-2 border-purple-200 focus:border-purple-500 focus:outline-none py-2 transition-colors bg-transparent placeholder-gray-300"
            placeholder="0"
          />
        </div>
      </div>

      {/* 2-Piece Set Input */}
      <div className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
        <div className="bg-blue-50 p-4 border-b border-blue-100 flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
            <Box size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900">2片装小折盒 (Plan B)</h3>
            <p className="text-xs text-blue-600">包含: 1盒, 2袋, 4精华, etc.</p>
          </div>
        </div>
        <div className="p-6">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            计划生产数量 (盒)
          </label>
          <input
            type="number"
            min="0"
            value={set2}
            onChange={(e) => onChange('set2', Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full text-3xl font-bold text-gray-800 border-b-2 border-blue-200 focus:border-blue-500 focus:outline-none py-2 transition-colors bg-transparent placeholder-gray-300"
            placeholder="0"
          />
        </div>
      </div>
    </div>
  );
};
