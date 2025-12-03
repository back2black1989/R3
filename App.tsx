import React, { useState, useMemo } from 'react';
import { ProductionInput } from './components/ProductionInput';
import { BOMTable } from './components/BOMTable';
import { SummaryCards } from './components/SummaryCards';
import { COMPONENT_DEFINITIONS, RATIO_SET_8, RATIO_SET_2, ProductionPlan, ComponentId } from './types';
import { Settings2 } from 'lucide-react';

export default function App() {
  // State for Production Plan Input
  const [plan, setPlan] = useState<ProductionPlan>({
    set8: 1000,
    set2: 2000,
  });

  // State for MOQ and Cost configurations
  // Initialize with default values from definitions
  const [settings, setSettings] = useState<Record<string, { moq: number; cost: number }>>(() => {
    const initial: Record<string, { moq: number; cost: number }> = {};
    COMPONENT_DEFINITIONS.forEach(comp => {
      initial[comp.id] = { moq: comp.defaultMoq, cost: comp.defaultCost };
    });
    return initial;
  });

  const handlePlanChange = (field: 'set8' | 'set2', value: number) => {
    setPlan(prev => ({ ...prev, [field]: value }));
  };

  const handleSettingChange = (id: ComponentId, field: 'moq' | 'cost', value: number) => {
    setSettings(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  // Calculate totals for summary cards
  const summary = useMemo(() => {
    let totalCost = 0;
    let inventoryValue = 0;
    let totalItems = 0;

    COMPONENT_DEFINITIONS.forEach(comp => {
      const qtyPer8 = RATIO_SET_8[comp.id] || 0;
      const qtyPer2 = RATIO_SET_2[comp.id] || 0;
      const totalNeeded = (plan.set8 * qtyPer8) + (plan.set2 * qtyPer2);
      
      const currentMoq = settings[comp.id]?.moq || 0;
      const currentCost = settings[comp.id]?.cost || 0;
      
      const batches = currentMoq > 0 ? Math.ceil(totalNeeded / currentMoq) : 1;
      const orderQty = totalNeeded > 0 ? (batches * currentMoq) : 0;
      
      const leftover = Math.max(0, orderQty - totalNeeded);
      
      totalCost += orderQty * currentCost;
      inventoryValue += leftover * currentCost;
      totalItems += orderQty;
    });

    return { totalCost, inventoryValue, totalItems };
  }, [plan, settings]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Settings2 size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">供应链物料换算系统</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Manufacturing BOM & Cost Calculator</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
             v1.0.0
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Step 1: Input Production Plan */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-gray-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">1</span>
            <h2 className="text-lg font-bold text-gray-800">输入生产计划 (Input Production Plan)</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4 ml-8">
            输入您计划组装的成品数量，系统将自动分解所需部件。
          </p>
          <ProductionInput 
            set8={plan.set8} 
            set2={plan.set2} 
            onChange={handlePlanChange} 
          />
        </section>

        {/* Step 2: Summary Dashboard */}
         <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
             <span className="bg-gray-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">2</span>
            <h2 className="text-lg font-bold text-gray-800">成本概览 (Cost Overview)</h2>
          </div>
          <SummaryCards 
            totalCost={summary.totalCost} 
            inventoryValue={summary.inventoryValue}
            totalItems={summary.totalItems}
          />
        </section>

        {/* Step 3: Detailed BOM Table */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="bg-gray-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">3</span>
              <h2 className="text-lg font-bold text-gray-800">物料详情与采购调整 (Details)</h2>
            </div>
            <span className="text-xs bg-amber-50 text-amber-700 px-3 py-1 rounded-full border border-amber-100">
              提示: 可直接修改表格中的 MOQ 和 单价
            </span>
          </div>
          <BOMTable 
            plan={plan} 
            settings={settings}
            onSettingChange={handleSettingChange}
          />
        </section>

      </main>
    </div>
  );
}
