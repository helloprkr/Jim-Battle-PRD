import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { Activity, Heart, Moon, Apple } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { RootState } from '@/store';
import { setMetrics } from '@/store/slices/healthSlice';
import { LineChart } from '@/components/charts/LineChart';

export const Health = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const { data: healthData } = useQuery({
    queryKey: ['health-detailed', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('health')
        .select('*')
        .eq('userId', user?.id)
        .order('timestamp', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (healthData) {
      dispatch(setMetrics(healthData));
    }
  }, [healthData, dispatch]);

  const categories = [
    { name: 'Activity', icon: Activity, color: 'text-blue-400' },
    { name: 'Heart Rate', icon: Heart, color: 'text-red-400' },
    { name: 'Sleep', icon: Moon, color: 'text-purple-400' },
    { name: 'Nutrition', icon: Apple, color: 'text-green-400' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Health Tracking</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <div key={category.name} className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6">
              <div className="flex items-center space-x-2">
                <Icon className={`h-5 w-5 ${category.color}`} />
                <h3 className="text-white font-medium">{category.name}</h3>
              </div>
              <div className="mt-4">
                <LineChart
                  data={healthData?.filter(d => d.type === category.name.toLowerCase()) || []}
                  xKey="timestamp"
                  yKey="value"
                  color={category.color}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-lg font-medium text-white mb-4">Daily Log</h2>
          <div className="space-y-4">
            {healthData?.slice(0, 5).map((entry) => (
              <div key={entry.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">{entry.type}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(entry.timestamp).toLocaleString()}
                  </p>
                </div>
                <span className="text-sm text-gray-400">
                  {entry.value} {entry.unit}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-lg font-medium text-white mb-4">Health Goals</h2>
          <div className="space-y-4">
            {categories.map((category) => {
              const Icon = category.icon;
              const progress = Math.random() * 100;
              return (
                <div key={category.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon className={`h-4 w-4 ${category.color}`} />
                      <span className="text-sm text-white">{category.name}</span>
                    </div>
                    <span className="text-sm text-gray-400">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full">
                    <div
                      className={`h-full rounded-full bg-current ${category.color}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};