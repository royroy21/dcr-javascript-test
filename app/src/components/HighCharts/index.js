import React, {useEffect, useState} from 'react';
import Highcharts from 'highcharts';
import countries from "../../data/countries.json"
import HCMore from 'highcharts/highcharts-more';

HCMore(Highcharts);

const BY_COUNTRY_POPULATION_SIZE = "By Country - Population size";
const BY_COUNTRY_NUMBER_OF_BORDERS = "By Country - Number of borders";
const BY_COUNTRY_NUMBER_OF_TIMEZONES = "By Country - Number of timezones";
const BY_COUNTRY_NUMBER_OF_LANGUAGES = "By Country - Number of languages";
const BY_REGION_NUMBER_OF_COUNTRIES = "By Region - Number of countries";
const BY_REGION_NUMBER_OF_UNIQUE_TIMEZONES = "By Region - Number of unique timezones";

const PackedBubbleChart = () => {
  const [chartData, setChartData] = useState([]);

  const getPopulations = () => {
    const populations = countries.map(country => ({
      name: country.name,
      label: `${country.alpha3Code}<br />${country.population}`,
      value: country.population,
    }))
    return [
      {
        name: BY_COUNTRY_POPULATION_SIZE,
        data: populations,
      }
    ]
  }

  const getNumberOfBorders = () => {
    const borders = countries.map(country => ({
      name: country.name,
      label: `${country.alpha3Code}<br />${country.borders.length}`,
      value: country.borders.length,
    }))
    return [
      {
        name: BY_COUNTRY_NUMBER_OF_BORDERS,
        data: borders,
      }
    ]
  }

  const getNumberOfTimeZones = () => {
    const timeZones = countries.map(country => ({
      name: country.name,
      label: `${country.alpha3Code}<br />${country.timezones.length}`,
      value: country.timezones.length,
    }))
    return [
      {
        name: BY_COUNTRY_NUMBER_OF_TIMEZONES,
        data: timeZones,
      }
    ]
  }

  const getNumberOfLanguages = () => {
    const languages = countries.map(country => ({
      name: country.name,
      label: `${country.alpha3Code}<br />${country.languages.length}`,
      value: country.languages.length,
    }))
    return [
      {
        name: BY_COUNTRY_NUMBER_OF_LANGUAGES,
        data: languages,
      }
    ]
  }

  const getNumberOfCountries = () => {
    const regions = {
      'Africa': 0,
      'Americas': 0,
      'Asia': 0,
      'Europe': 0,
      'Oceania': 0,
      'Polar': 0,
    }
    countries.forEach(country => {regions[country.region] += 1})
    const formattedRegions = []
    for (const [key, value] of Object.entries(regions)) {
      formattedRegions.push({
        name: key,
        label: `${key}<br />${value}`,
        value: value,
      })
    }
    return [
      {
        name: BY_REGION_NUMBER_OF_COUNTRIES,
        data: formattedRegions,
      }
    ]
  }

  const getNumberOfUniqueTimeZones = () => {
    const regions = {
      'Africa': [],
      'Americas': [],
      'Asia': [],
      'Europe': [],
      'Oceania': [],
      'Polar': [],
    }
    countries.forEach(country => {
      country.timezones.forEach(timezone => {
        if (!regions[country.region].includes(timezone)) {
          regions[country.region].push(timezone)
        }
      })
    })
    const formattedRegions = []
    for (const [key, value] of Object.entries(regions)) {
      formattedRegions.push({
        name: key,
        label: `${key}<br />${value.length}`,
        value: value.length,
      })
    }
    return [
      {
        name: BY_REGION_NUMBER_OF_UNIQUE_TIMEZONES,
        data: formattedRegions,
      }
    ]
  }

  useEffect(() => {
    // Set initial data.
    setChartData(getPopulations());
  }, [])

  useEffect(() => {
    const options = {
      chart: {
          type: 'packedbubble',
      },
      title: {
          text: '',
      },
      plotOptions: {
        packedbubble: {
          dataLabels: {
            enabled: true,
            format: '{point.label}',
            style: {
              color: 'black',
              textOutline: 'none',
              fontWeight: 'bold'
            },
          },
          minSize: 5,
          maxSize: 100,
        },
      },
      series: chartData,
  }
    Highcharts.chart('chart-container', options);
  }, [chartData]);

  const handleChange = (event) => {
    switch(event.target.value) {
      case BY_COUNTRY_POPULATION_SIZE:
        setChartData(getPopulations());
        break;
      case BY_COUNTRY_NUMBER_OF_BORDERS:
        setChartData(getNumberOfBorders());
        break;
      case BY_COUNTRY_NUMBER_OF_TIMEZONES:
        setChartData(getNumberOfTimeZones());
        break;
      case BY_COUNTRY_NUMBER_OF_LANGUAGES:
        setChartData(getNumberOfLanguages());
        break;
      case BY_REGION_NUMBER_OF_COUNTRIES:
        setChartData(getNumberOfCountries());
        break;
      case BY_REGION_NUMBER_OF_UNIQUE_TIMEZONES:
        setChartData(getNumberOfUniqueTimeZones());
        break;
      default:
        setChartData(getPopulations());
    }
  }

  return (
    <div>
      <select onChange={handleChange}>
        <option value={BY_COUNTRY_POPULATION_SIZE}>{BY_COUNTRY_POPULATION_SIZE}</option>
        <option value={BY_COUNTRY_NUMBER_OF_BORDERS}>{BY_COUNTRY_NUMBER_OF_BORDERS}</option>
        <option value={BY_COUNTRY_NUMBER_OF_TIMEZONES}>{BY_COUNTRY_NUMBER_OF_TIMEZONES}</option>
        <option value={BY_COUNTRY_NUMBER_OF_LANGUAGES}>{BY_COUNTRY_NUMBER_OF_LANGUAGES}</option>
        <option value={BY_REGION_NUMBER_OF_COUNTRIES}>{BY_REGION_NUMBER_OF_COUNTRIES}</option>
        <option value={BY_REGION_NUMBER_OF_UNIQUE_TIMEZONES}>{BY_REGION_NUMBER_OF_UNIQUE_TIMEZONES}</option>
      </select>
      <div style={styles.chartContainer} id="chart-container" />
      {chartData.length ? (
      <div>
        <table>
          <thead>
            <tr>
              <th>{""}</th>
              <th>{chartData[0].name}</th>
            </tr>
          </thead>
          <tbody>
          {chartData[0].data.map((d, index) => (
            <tr key={index}>
              <td>{d.name}</td>
              <td>{d.value}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
      ) : null}
    </div>
  )
};

const styles = {
  chartContainer: {
    height: 800,
    width: "100%",
  },
}

export default PackedBubbleChart;
