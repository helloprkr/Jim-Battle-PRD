import { useState } from 'react';
import { Apple, Calendar, ShoppingCart, Book } from 'lucide-react';

export const Nutrition = () => {
  const [activeTab, setActiveTab] = useState('meal-plan');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Nutrition</h1>
      
      <div className="flex space-x-4 border-b border-slate-700">
        <button
          onClick={() => setActiveTab('meal-plan')}
          className={`pb-2 text-sm font-medium ${
            activeTab === 'meal-plan'
              ? 'text-white border-b-2 border-indigo-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Meal Plan
        </button>
        <button
          onClick={() => setActiveTab('recipes')}
          className={`pb-2 text-sm font-medium ${
            activeTab === 'recipes'
              ? 'text-white border-b-2 border-indigo-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Recipes
        </button>
        <button
          onClick={() => setActiveTab('shopping')}
          className={`pb-2 text-sm font-medium ${
            activeTab === 'shopping'
              ? 'text-white border-b-2 border-indigo-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Shopping List
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="h-5 w-5 text-indigo-400" />
            <h2 className="text-lg font-medium text-white">Weekly Plan</h2>
          </div>
          <p className="text-gray-400">Coming soon...</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Book className="h-5 w-5 text-green-400" />
            <h2 className="text-lg font-medium text-white">Recipe Collection</h2>
          </div>
          <p className="text-gray-400">Coming soon...</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <ShoppingCart className="h-5 w-5 text-yellow-400" />
            <h2 className="text-lg font-medium text-white">Shopping List</h2>
          </div>
          <p className="text-gray-400">Coming soon...</p>
        </div>
      </div>
    </div>
  );
};