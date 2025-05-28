// src/components/Watchlist/CryptoChart.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import { Card } from 'react-bootstrap';

const CryptoChart = ({ cryptoId }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart?vs_currency=usd&days=7&interval=daily`
        );

        const formattedData = response.data.prices.map((item) => ({
          x: new Date(item[0]),
          y: item[1].toFixed(2),
        }));

        setChartData(formattedData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load chart data');
        setLoading(false);
      }
    };

    if (cryptoId) {
      fetchChartData();
    }
  }, [cryptoId]);

  const chartOptions = {
    chart: {
      type: 'line',
      height: 350,
    },
    xaxis: {
      type: 'datetime',
    },
    yaxis: {
      labels: {
        formatter: (value) => `$${value.toFixed(2)}`,
      },
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    tooltip: {
      x: {
        format: 'dd MMM yyyy',
      },
    },
  };

  if (loading) return <div>Loading chart...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Card className="mt-4 p-3">
      <h5>{cryptoId.toUpperCase()} Price Chart (7 Days)</h5>
      <Chart
        options={chartOptions}
        series={[{ name: 'Price', data: chartData }]}
        type="line"
        height={350}
      />
    </Card>
  );
};

export default CryptoChart;