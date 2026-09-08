/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Chart from "react-google-charts";
import Menu from "./Menu";
import { API_URL } from "../utils/api";

export const optionsBar = {
    title: "Historial de pedidos",
    chartArea: { width: "50%" },
    colors: ["#b0120a", "#ffab91"],
    hAxis: {
        title: "Pedidos",
        minValue: 0,
    },
    vAxis: {
        title: "Fecha",
    }
};

export const optionsPie = {
    title: "Cantidad de Pedidos Producto",
};

function ChartsGoogle() {

    const [datosChartBar, setDatosChartBar] = useState<any>();
    const [datosChartPie, setDatosChartPie] = useState<any>();

    const getBarChart = async () => {
        const response = await fetch(`${API_URL}/api/pedidos/barchart`)
        const datosBackend = await response.json();
        console.log(datosBackend);
        setDatosChartBar(datosBackend);
    }
    
    const getPieChart = async () => {
        const response = await fetch(`${API_URL}/api/pedidos/piechart`)
        const datosBackend = await response.json();
        console.log(datosBackend);
        setDatosChartPie(datosBackend);
    }

    useEffect(() => {
        getBarChart();
        getPieChart();
    }, []);


    return (
        
        <>
        <Menu />
            <Chart
                chartType="LineChart"
                width="100%"
                height="400px"
                data={datosChartBar}
                options={optionsBar}
            />
            <Chart
                chartType="ColumnChart"
                data={datosChartPie}
                options={optionsPie}
                width={"100%"}
                height={"400px"}
            />
        </>
    )
}

export default ChartsGoogle