import { useIntl } from 'react-intl';
import Chart from 'react-apexcharts';

const ResponsiveDonutChart = ({
  options,
  series,
  titleId
}: {
  options: any;
  series: number[];
  titleId: string;
}) => {
  const intl = useIntl();

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-center font-medium mb-2 text-sm lg:text-base">
        {intl.formatMessage({ id: titleId })}
      </h3>
      <div className="flex-1 min-h-[250px]">
        <Chart options={options} series={series} type="donut" height="100%" width="100%" />
      </div>
    </div>
  );
};

const ResponsiveBarChart = ({
  options,
  series,
  titleId
}: {
  options: any;
  series: any[];
  titleId: string;
}) => {
  const intl = useIntl();

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-center font-medium mb-2 text-sm lg:text-base">
        {intl.formatMessage({ id: titleId })}
      </h3>
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
  const intl = useIntl();

  const options = {
    labels: [
      intl.formatMessage({ id: 'DASHBOARD.ACTIVE' }),
      intl.formatMessage({ id: 'DASHBOARD.SCHEDULED' })
    ],
    colors: ['#3B82F6', '#E5E7EB'],
    legend: { position: 'bottom' as const },
    dataLabels: { enabled: false }
  };
  const series = [65, 35];
  return (
    <ResponsiveDonutChart options={options} series={series} titleId="DASHBOARD.DELIVERY_STATUS" />
  );
};

const AppealsDonutChart = () => {
  const intl = useIntl();

  const options = {
    labels: [
      intl.formatMessage({ id: 'DASHBOARD.ACTIVE' }),
      intl.formatMessage({ id: 'DASHBOARD.TOTAL' })
    ],
    colors: ['#10B981', '#E5E7EB'],
    legend: { position: 'bottom' as const },
    dataLabels: { enabled: false }
  };
  const series = [42, 58];
  return (
    <ResponsiveDonutChart options={options} series={series} titleId="DASHBOARD.CUSTOMER_REQUESTS" />
  );
};

const PVZDonutChart = () => {
  const intl = useIntl();

  const options = {
    labels: [
      intl.formatMessage({ id: 'DASHBOARD.ACTIVE' }),
      intl.formatMessage({ id: 'DASHBOARD.SCHEDULED' })
    ],
    colors: ['#F59E0B', '#E5E7EB'],
    legend: { position: 'bottom' as const },
    dataLabels: { enabled: false }
  };
  const series = [28, 72];
  return (
    <ResponsiveDonutChart options={options} series={series} titleId="DASHBOARD.PICKUP_POINTS" />
  );
};

const OrdersBarChart = () => {
  const intl = useIntl();

  const options = {
    chart: { type: 'bar' as const },
    xaxis: {
      categories: [
        intl.formatMessage({ id: 'DASHBOARD.ALL' }),
        intl.formatMessage({ id: 'DASHBOARD.ON_TIME' }),
        intl.formatMessage({ id: 'DASHBOARD.LATE' })
      ]
    },
    colors: ['#3B82F6', '#10B981', '#EF4444'],
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '60%'
      }
    }
  };
  const series = [
    {
      name: intl.formatMessage({ id: 'DASHBOARD.COUNT' }),
      data: [120, 90, 30]
    }
  ];
  return <ResponsiveBarChart options={options} series={series} titleId="DASHBOARD.ORDER_STATS" />;
};

const AppealsQualityBarChart = () => {
  const intl = useIntl();

  const options = {
    chart: { type: 'bar' as const },
    xaxis: {
      categories: [
        intl.formatMessage({ id: 'DASHBOARD.ALL' }),
        intl.formatMessage({ id: 'DASHBOARD.RATING_HIGH' }),
        intl.formatMessage({ id: 'DASHBOARD.RATING_LOW' })
      ]
    },
    colors: ['#3B82F6', '#10B981', '#EF4444'],
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '60%'
      }
    }
  };
  const series = [
    {
      name: intl.formatMessage({ id: 'DASHBOARD.COUNT' }),
      data: [85, 65, 20]
    }
  ];
  return (
    <ResponsiveBarChart options={options} series={series} titleId="DASHBOARD.REQUEST_QUALITY" />
  );
};

const DepartmentTasksBarChart = () => {
  const intl = useIntl();

  const options = {
    chart: { type: 'bar' as const },
    xaxis: {
      categories: [
        intl.formatMessage({ id: 'DASHBOARD.LOGISTICS' }),
        intl.formatMessage({ id: 'DASHBOARD.CALL_CENTER' }),
        intl.formatMessage({ id: 'DASHBOARD.IT' }),
        intl.formatMessage({ id: 'DASHBOARD.MARKETING' })
      ],
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
    {
      name: intl.formatMessage({ id: 'DASHBOARD.SCHEDULED' }),
      data: [45, 32, 28, 15]
    },
    {
      name: intl.formatMessage({ id: 'DASHBOARD.OVERDUE' }),
      data: [12, 5, 3, 2]
    }
  ];
  return <ResponsiveBarChart options={options} series={series} titleId="DASHBOARD.DEPT_TASKS" />;
};

const TeamTasksBarChart = () => {
  const intl = useIntl();

  const options = {
    chart: { type: 'bar' as 'bar' },
    xaxis: {
      categories: [
        intl.formatMessage({ id: 'DASHBOARD.DELIVERY' }),
        intl.formatMessage({ id: 'DASHBOARD.SUPPORT' }),
        intl.formatMessage({ id: 'DASHBOARD.DEV' }),
        intl.formatMessage({ id: 'DASHBOARD.ANALYTICS' })
      ],
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
    {
      name: intl.formatMessage({ id: 'DASHBOARD.SCHEDULED' }),
      data: [30, 25, 20, 10]
    },
    {
      name: intl.formatMessage({ id: 'DASHBOARD.OVERDUE' }),
      data: [8, 3, 2, 1]
    }
  ];
  return <ResponsiveBarChart options={options} series={series} titleId="DASHBOARD.TEAM_TASKS" />;
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
