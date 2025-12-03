import React from 'react';
import { DollarSign, Archive, TrendingUp, AlertTriangle } from 'lucide-react';

interface SummaryCardsProps {
  totalCost: number;
  inventoryValue: number;
  totalItems: number;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ totalCost, inventoryValue, totalItems }) => {
  
  const effectiveCost = totalCost - inventoryValue;
  const inventoryPercentage = totalCost > 0 ? (inventoryValue / totalCost) * 100 : 0;

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      
      {/* Total Investment */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <DollarSign size={100} />
        </div>
        <div className="relative z-10">
          <p className="text-indigo-100 font-medium mb-1">采购总资金投入</p>
          <h2 className="text-4xl font-bold mb-2">{formatCurrency(totalCost)}</h2>
          <div className="flex items-center gap-2 text-sm text-indigo-200 bg-indigo-800/30 px-3 py-1 rounded-full w-fit">
            <Archive size={14} />
            <span>采购物料总数: {new Intl.NumberFormat().format(totalItems)} 件</span>
          </div>
        </div>
      </div>

      {/* Inventory Value */}
      <div className="bg-white rounded-xl shadow-sm border border-orange-200 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 text-orange-500">
          <AlertTriangle size={80} />
        </div>
        <div className="relative z-10">
          <p className="text-gray-500 font-medium mb-1">剩余库存价值 (沉淀资金)</p>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{formatCurrency(inventoryValue)}</h2>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div 
              className="bg-orange-500 h-2.5 rounded-full" 
              style={{ width: `${Math.min(inventoryPercentage, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500">
            占总投入的 <span className="font-bold text-orange-600">{inventoryPercentage.toFixed(1)}%</span> 
            (由于起订量限制需储存的物料)
          </p>
        </div>
      </div>

      {/* Effective Cost */}
      <div className="bg-white rounded-xl shadow-sm border border-emerald-200 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 text-emerald-500">
          <TrendingUp size={80} />
        </div>
        <div className="relative z-10">
          <p className="text-gray-500 font-medium mb-1">本次生产实际物料消耗</p>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{formatCurrency(effectiveCost)}</h2>
          <p className="text-sm text-gray-500">
            实际用于组成成品的物料成本。剩余部分可用于下一批次生产。
          </p>
        </div>
      </div>

    </div>
  );
};
