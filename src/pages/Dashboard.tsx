import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Activity, BarChart2, Heart, Briefcase } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { RootState } from '@/store';
import { setMetrics } from '@/store/slices/healthSlice';
import { setProjects } from '@/store/slices/projectSlice';

export const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const { data: healthData } = useQuery({
    queryKey: ['health', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('health')
        .select('*')
        .eq('userId', user?.id)
        .order('timestamp', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: projectsData } = useQuery({
    queryKey: ['projects', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('userId', user?.id)
        .order('priority', { ascending: false })
        .limit(5);
      
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

  useEffect(() => {
    if (projectsData) {
      dispatch(setProjects(projectsData));
    }
  }, [projectsData, dispatch]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Daily Activity"
          value="85%"
          icon={Activity}
          trend="+5%"
          trendUp={true}
        />
        <StatCard
          title="Health Score"
          value="92"
          icon={Heart}
          trend="+2%"
          trendUp={true}
        />
        <StatCard
          title="Active Projects"
          value={projectsData?.length || "0"}
          icon={Briefcase}
          trend="2 new"
          trendUp={true}
        />
        <StatCard
          title="Weekly Progress"
          value="78%"
          icon={BarChart2}
          trend="-3%"
          trendUp={false}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivities data={healthData} />
        <PriorityProjects data={projectsData} />
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend: string;
  trendUp: boolean;
}

const StatCard = ({ title, value, icon: Icon, trend, trendUp }: StatCardProps) => (
  <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6">
    <div className="flex items-center justify-between">
      <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
      <Icon className="h-5 w-5 text-gray-400" />
    </div>
    <div className="mt-2 flex items-baseline">
      <p className="text-2xl font-semibold text-white">{value}</p>
      <span className={`ml-2 text-sm ${trendUp ? 'text-green-400' : 'text-red-400'}`}>
        {trend}
      </span>
    </div>
  </div>
);

const RecentActivities = ({ data }: { data: any[] | undefined }) => (
  <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6">
    <h2 className="text-lg font-medium text-white mb-4">Recent Activities</h2>
    <div className="space-y-4">
      {data?.map((activity) => (
        <div key={activity.id} className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">{activity.type}</p>
            <p className="text-xs text-gray-400">
              {new Date(activity.timestamp).toLocaleDateString()}
            </p>
          </div>
          <span className="text-sm text-gray-400">{activity.value}</span>
        </div>
      ))}
    </div>
  </div>
);

const PriorityProjects = ({ data }: { data: any[] | undefined }) => (
  <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6">
    <h2 className="text-lg font-medium text-white mb-4">Priority Projects</h2>
    <div className="space-y-4">
      {data?.map((project) => (
        <div key={project.id} className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">{project.title}</p>
            <p className="text-xs text-gray-400">{project.status}</p>
          </div>
          <span className={`px-2 py-1 text-xs rounded-full ${
            project.priority > 2 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
          }`}>
            Priority {project.priority}
          </span>
        </div>
      ))}
    </div>
  </div>
);