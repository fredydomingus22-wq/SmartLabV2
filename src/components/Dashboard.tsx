import React from 'react';

const Dashboard = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* KPI Cards */}
      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium">Compliance</h3>
        </div>
        <div className="p-6 pt-0">
          <div className="text-2xl font-bold">99.2%</div>
          <p className="text-xs text-muted-foreground">+0.5% from last week</p>
        </div>
      </div>
      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium">Lots Released</h3>
        </div>
        <div className="p-6 pt-0">
          <div className="text-2xl font-bold">1,204</div>
          <p className="text-xs text-muted-foreground">+12% from yesterday</p>
        </div>
      </div>
      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium">Lots Blocked</h3>
        </div>
        <div className="p-6 pt-0">
          <div className="text-2xl font-bold">12</div>
          <p className="text-xs text-muted-foreground">2 critical deviations</p>
        </div>
      </div>
      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium">Avg. TAT</h3>
        </div>
        <div className="p-6 pt-0">
          <div className="text-2xl font-bold">45 min</div>
          <p className="text-xs text-muted-foreground">-5 min from yesterday</p>
        </div>
      </div>

      {/* Main Chart and Donut Chart */}
      <div className="col-span-1 lg:col-span-2 rounded-xl border bg-card text-card-foreground shadow">
        <div className="p-6">
          <h3 className="font-semibold">Trend Analysis</h3>
          <p className="text-sm text-muted-foreground">Critical Parameter Trend (e.g., Brix)</p>
          <div className="h-64 bg-muted mt-4 rounded-md"></div>
        </div>
      </div>
      <div className="col-span-1 lg:col-span-2 rounded-xl border bg-card text-card-foreground shadow">
        <div className="p-6">
          <h3 className="font-semibold">Deviations Overview</h3>
          <p className="text-sm text-muted-foreground">Distribution by criticality</p>
          <div className="h-64 bg-muted mt-4 rounded-md"></div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="col-span-1 lg:col-span-4 rounded-xl border bg-card text-card-foreground shadow">
        <div className="p-6">
          <h3 className="font-semibold">Production Line Heatmap</h3>
          <p className="text-sm text-muted-foreground">Compliance by Line and Shift</p>
          <div className="h-80 bg-muted mt-4 rounded-md"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
