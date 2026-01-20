import React from 'react';
import Card from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Dashboard
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card title="Welcome">
          <p className="text-gray-600">
            Hello <strong>{user?.name || 'Student'}</strong>! This is your
            dashboard. Here you can see an overview of your activities.
          </p>
        </Card>
        <Card title="Quick Stats">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Assignments</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">12</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Completed</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">8</dd>
            </div>
          </dl>
        </Card>
        <Card title="Notifications">
          <p className="text-gray-500 italic">No new notifications.</p>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
