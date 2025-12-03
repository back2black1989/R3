import React, { useState, useEffect } from 'react';
import { COMPONENT_DEFINITIONS, RATIO_SET_8, RATIO_SET_2, ProductionPlan, ComponentId } from '../types';
import { AlertCircle, Layers } from 'lucide-react';

interface ComponentSettings {
  moq: number;
  cost: number;
}

interface BOMTableProps {
  plan: ProductionPlan;
  settings: Record<ComponentId, ComponentSettings>;
  onSettingChange: (id: ComponentId, field: 'moq' | 'cost', value: number) => void;
}

// Helper component to handle number inputs smoothly (especially decimals like "0.")
const EditableNumber = ({ 
  value, 
  onChange, 
  ...props 
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> & { 
  value: number; 
  onChange: (val: number) => void; 
}) => {
  const [localValue, setLocalValue] = useState<string>(value.toString());

  // Sync with external value changes (e.g. reset or loaded data), 
  // but avoid overwriting the user's current input if it parses to the same number.
  // This allows "0." (parsed as 0) to persist visually while the underlying value is 0.
  useEffect(() => {
    const parsedLocal = parseFloat(localValue);
    // If the external value matches our parsed local value, we assume the user is typing
    // and we shouldn't interfere with the string format (e.g. don't turn "0.50" into "0.5").
    // If they are different, it means the value changed externally, so we must sync.
    if (parsedLocal !== value) {
      // Edge case: if input is empty and value is 0, keep it empty to allow typing
      if (localValue === '' && value === 0) return;
      setLocalValue(value.toString());
    }
  }, [value, localValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    setLocalValue(rawValue);

    const parsed = parseFloat(rawValue);
    if (!isNaN(parsed)) {
      onChange(parsed);
    } else if (rawValue === '') {
      onChange(0);
    }
  };

  const handleBlur = () => {
    // On blur, strictly format to the standard string representation
    setLocalValue(value.toString());
  };

  return (
    <input
      {...props}
      value={localValue}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
};

export const BOMTable: React.FC<BOMTableProps> = ({ plan, settings, onSettingChange }) => {
  const calculateRow = (comp: typeof COMPONENT_DEFINITIONS[0]) => {
    const qtyPer8 = RATIO_SET_8[comp.id] || 0;
    const qtyPer2 = RATIO_SET_2[comp.id] || 0;
    
    // Total needed purely for assembly
    const totalNeeded = (plan.set8 * qtyPer8) + (plan.set2 * qtyPer2);
    
    // Procurement Logic
    const currentMoq = settings[comp.id]?.moq ?? comp.defaultMoq;
    const currentCost = settings[comp.id]?.cost ?? comp.defaultCost;
    
    // Calculate Order Qty based on MOQ batch sizes
    // If MOQ is 1000, and we need 500, we buy 1000. If we need 1500, we buy 2000.
    const batches = currentMoq > 0 ? Math.ceil(totalNeeded / currentMoq) : 1;
    const orderQty = totalNeeded > 0 ? (batches * currentMoq) : 0;
    
    const leftover = orderQty - totalNeeded;
    const totalCost = orderQty * currentCost;
    const wastedCost = leftover * currentCost; // Value of inventory

    return {
      qtyPer8,
      qtyPer2,
      totalNeeded,
      currentMoq,
      currentCost,
      orderQty,
      leftover,
      totalCost,
      wastedCost
    };
  };

  const rows = COMPONENT_DEFINITIONS.map(comp => ({
    ...comp,
    ...calculateRow(comp)
  }));

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(val);

  const formatNumber = (val: number) => 
    new Intl.NumberFormat('zh-CN').format(val);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h2 className="font-bold text-gray-800 flex items-center gap-2">
          <Layers className="text-indigo-600" size={20} />
          物料需求清单 (BOM)
        </h2>
        <div className="text-xs text-gray-500 flex items-center gap-1">
          <AlertCircle size={14} />
          <span>橙色高亮表示库存/结余较高</span>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 font-medium">部件名称</th>
              <th className="px-4 py-3 text-center bg-purple-50/50">8片装<br/>用量</th>
              <th className="px-4 py-3 text-center bg-blue-50/50">2片装<br/>用量</th>
              <th className="px-6 py-3 font-bold text-indigo-700 bg-indigo-50/30 border-l border-indigo-100">
                总需求量
              </th>
              <th className="px-6 py-3 w-32 bg-amber-50/30 border-l border-amber-100">
                采购起订量 (MOQ)
              </th>
              <th className="px-6 py-3 w-32 bg-amber-50/30">
                单价 (¥)
              </th>
              <th className="px-6 py-3 font-bold text-gray-800 border-l border-gray-200">
                建议采购量
              </th>
              <th className="px-6 py-3 text-gray-500">
                剩余库存
              </th>
              <th className="px-6 py-3 text-right font-bold text-gray-800">
                采购成本
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {row.name}
                  {row.leftover > 0 && row.leftover > row.currentMoq * 0.5 && (
                     <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                       囤货多
                     </span>
                  )}
                </td>
                <td className="px-4 py-4 text-center text-gray-500 bg-purple-50/20">{row.qtyPer8}</td>
                <td className="px-4 py-4 text-center text-gray-500 bg-blue-50/20">{row.qtyPer2}</td>
                <td className="px-6 py-4 font-bold text-indigo-600 bg-indigo-50/20 border-l border-indigo-50">
                  {formatNumber(row.totalNeeded)}
                </td>
                
                {/* Inputs */}
                <td className="px-4 py-3 bg-amber-50/10 border-l border-amber-50">
                  <div className="relative rounded-md shadow-sm">
                    <EditableNumber
                      type="number"
                      value={row.currentMoq}
                      onChange={(val) => onSettingChange(row.id, 'moq', val)}
                      className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white"
                    />
                  </div>
                </td>
                <td className="px-4 py-3 bg-amber-50/10">
                  <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                      <span className="text-gray-500 sm:text-xs">¥</span>
                    </div>
                    <EditableNumber
                      type="number"
                      step="0.01"
                      value={row.currentCost}
                      onChange={(val) => onSettingChange(row.id, 'cost', val)}
                      className="block w-full rounded-md border-0 py-1.5 pl-5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white"
                    />
                  </div>
                </td>

                <td className="px-6 py-4 font-bold text-gray-900 border-l border-gray-100">
                  {formatNumber(row.orderQty)}
                </td>
                <td className="px-6 py-4 text-gray-500">
                  <div className="flex flex-col">
                    <span>{formatNumber(row.leftover)}</span>
                    {row.leftover > 0 && (
                      <span className="text-[10px] text-gray-400">
                        价值: {formatCurrency(row.wastedCost)}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-bold text-gray-900">
                  {formatCurrency(row.totalCost)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-100 border-t border-gray-200">
             <tr>
                <td colSpan={8} className="px-6 py-4 text-right font-bold text-gray-700">总计预计成本:</td>
                <td className="px-6 py-4 text-right font-black text-xl text-indigo-600">
                  {formatCurrency(rows.reduce((acc, r) => acc + r.totalCost, 0))}
                </td>
             </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
