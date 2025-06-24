import Chart from 'react-apexcharts';

const ResponsiveDonutChart = ({
  options,
  series,
  title
}: {
  options: any;
  series: number[];
  title: string;
}) => {
  return (
    <div className="h-full flex flex-col">
      <h3 className="text-center font-medium mb-2 text-sm lg:text-base">{title}</h3>
      <div className="flex-1 min-h-[250px]">
        <Chart options={options} series={series} type="donut" height="100%" width="100%" />
      </div>
    </div>
  );
};

const ResponsiveBarChart = ({
  options,
  series,
  title
}: {
  options: any;
  series: any[];
  title: string;
}) => {
  return (
    <div className="h-full flex flex-col">
      <h3 className="text-center font-medium mb-2 text-sm lg:text-base">{title}</h3>
      <div className="flex-1 min-h-[300px]">
        <Chart
          options={{
            ...options,
            chart: {
              ...options.chart,
              toolbar: {
                show: false
              }
            },
            responsive: [
              {
                breakpoint: 640,
                options: {
                  plotOptions: {
                    bar: {
                      columnWidth: '45%'
                    }
                  },
                  legend: {
                    position: 'bottom'
                  }
                }
              }
            ]
          }}
          series={series}
          type="bar"
          height="100%"
          width="100%"
        />
      </div>
    </div>
  );
};

const DeliveryDonutChart = () => {
  const options = {
    labels: ['Active', 'Scheduled'],
    colors: ['#3B82F6', '#E5E7EB'],
    legend: { position: 'bottom' as const },
    dataLabels: { enabled: false }
  };
  const series = [65, 35];
  return <ResponsiveDonutChart options={options} series={series} title="Delivery Status" />;
};

const AppealsDonutChart = () => {
  const options = {
    labels: ['Active', 'Total'],
    colors: ['#10B981', '#E5E7EB'],
    legend: { position: 'bottom' as const },
    dataLabels: { enabled: false }
  };
  const series = [42, 58];
  return <ResponsiveDonutChart options={options} series={series} title="Customer Requests" />;
};

const PVZDonutChart = () => {
  const options = {
    labels: ['Active', 'Scheduled'],
    colors: ['#F59E0B', '#E5E7EB'],
    legend: { position: 'bottom' as const },
    dataLabels: { enabled: false }
  };
  const series = [28, 72];
  return <ResponsiveDonutChart options={options} series={series} title="Pickup Points" />;
};

const OrdersBarChart = () => {
  const options = {
    chart: { type: 'bar' as const },
    xaxis: { categories: ['All', 'On Time', 'Late'] },
    colors: ['#3B82F6', '#10B981', '#EF4444'],
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '60%'
      }
    }
  };
  const series = [{ name: 'Count', data: [120, 90, 30] }];
  return <ResponsiveBarChart options={options} series={series} title="Order Stats" />;
};

const AppealsQualityBarChart = () => {
  const options = {
    chart: { type: 'bar' as const },
    xaxis: { categories: ['All', 'Rating ≥4', 'Rating <4'] },
    colors: ['#3B82F6', '#10B981', '#EF4444'],
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '60%'
      }
    }
  };
  const series = [{ name: 'Count', data: [85, 65, 20] }];
  return <ResponsiveBarChart options={options} series={series} title="Request Quality" />;
};

const DepartmentTasksBarChart = () => {
  const options = {
    chart: { type: 'bar' as const },
    xaxis: {
      categories: ['Logistics', 'Call Center', 'IT', 'Marketing'],
      labels: { rotate: -45 }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 4,
        columnWidth: '45%'
      }
    },
    colors: ['#3B82F6', '#EF4444']
  };
  const series = [
    { name: 'Scheduled', data: [45, 32, 28, 15] },
    { name: 'Overdue', data: [12, 5, 3, 2] }
  ];
  return <ResponsiveBarChart options={options} series={series} title="Dept Tasks" />;
};

const TeamTasksBarChart = () => {
  const options = {
    chart: { type: 'bar' as 'bar' },
    xaxis: {
      categories: ['Delivery', 'Support', 'Dev', 'Analytics'],
      labels: { rotate: -45 }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 4,
        columnWidth: '45%'
      }
    },
    colors: ['#3B82F6', '#EF4444']
  };
  const series = [
    { name: 'Scheduled', data: [30, 25, 20, 10] },
    { name: 'Overdue', data: [8, 3, 2, 1] }
  ];
  return <ResponsiveBarChart options={options} series={series} title="Team Tasks" />;
};

export const DashboardContent = () => {
  return (
    <div className="grid gap-4 lg:gap-6 p-2 sm:p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="card p-3 sm:p-4">
          <DeliveryDonutChart />
        </div>
        <div className="card p-3 sm:p-4">
          <AppealsDonutChart />
        </div>
        <div className="card p-3 sm:p-4">
          <PVZDonutChart />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-3 sm:p-4">
          <OrdersBarChart />
        </div>
        <div className="card p-3 sm:p-4">
          <AppealsQualityBarChart />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-3 sm:p-4">
          <DepartmentTasksBarChart />
        </div>
        <div className="card p-3 sm:p-4">
          <TeamTasksBarChart />
        </div>
      </div>
    </div>
  );
};
