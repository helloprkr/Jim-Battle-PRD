import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Plus, MoreVertical } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { RootState } from '@/store';
import { setProjects } from '@/store/slices/projectSlice';

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: number;
}

const statusColumns = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'inProgress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'completed', title: 'Completed' },
];

export const Projects = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [localProjects, setLocalProjects] = useState<Project[]>([]);

  const { data: projectsData } = useQuery({
    queryKey: ['projects-board', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('userId', user?.id)
        .order('priority', { ascending: false });
      
      if (error) throw error;
      return data as Project[];
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (projectsData) {
      setLocalProjects(projectsData);
      dispatch(setProjects(projectsData));
    }
  }, [projectsData, dispatch]);

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId === destination.droppableId) {
      // Reorder within the same column
      const newProjects = Array.from(localProjects);
      const [removed] = newProjects.splice(source.index, 1);
      newProjects.splice(destination.index, 0, removed);
      setLocalProjects(newProjects);
    } else {
      // Move to different column
      const project = localProjects.find(p => p.id === draggableId);
      if (!project) return;

      const updatedProject = {
        ...project,
        status: destination.droppableId,
      };

      try {
        const { error } = await supabase
          .from('projects')
          .update({ status: destination.droppableId })
          .eq('id', project.id);

        if (error) throw error;

        const newProjects = localProjects.map(p =>
          p.id === project.id ? updatedProject : p
        );
        setLocalProjects(newProjects);
      } catch (error) {
        console.error('Error updating project status:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Projects</h1>
        <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          <Plus className="h-5 w-5 mr-2" />
          New Project
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statusColumns.map((column) => (
            <div
              key={column.id}
              className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4"
            >
              <h2 className="text-lg font-medium text-white mb-4">
                {column.title}
              </h2>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-3"
                  >
                    {localProjects
                      ?.filter((project) => project.status === column.id)
                      .map((project, index) => (
                        <Draggable
                          key={project.id}
                          draggableId={project.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-slate-700/50 rounded-lg p-4 cursor-pointer hover:bg-slate-700"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="text-sm font-medium text-white">
                                    {project.title}
                                  </h3>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {project.description}
                                  </p>
                                </div>
                                <button className="text-gray-400 hover:text-white">
                                  <MoreVertical className="h-4 w-4" />
                                </button>
                              </div>
                              <div className="mt-3 flex items-center justify-between">
                                <span
                                  className={`px-2 py-1 text-xs rounded-full ${
                                    project.priority > 2
                                      ? 'bg-red-500/20 text-red-400'
                                      : 'bg-green-500/20 text-green-400'
                                  }`}
                                >
                                  Priority {project.priority}
                                </span>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};