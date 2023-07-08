const BLUE = 'rgb(54, 162, 235)';
const TRANSPARENT = '#00000000';
const INITIAL_PRICE = 3900;

// chart
var chart;

function getDataset(yAxisID, label, borderColor, borderWidth, order) {
    return {
        label,
        borderColor,
        backgroundColor: TRANSPARENT,
        pointStyle: false,
        data: Array(1000).fill(INITIAL_PRICE),
        yAxisID,
        borderWidth,
        order
    };
}

function getDatasets() {
    return [
        getDataset('y', 'Price', BLUE, 2, 1),
    ];
}

function initChart(ctx) {
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array(1000).fill(''),
            datasets: getDatasets()
        },
        options: {
            animation: false,
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                    labels: {
                        pointStyle: 'line',
                        usePointStyle: true
                    }
                }
            },
            scales: {
                x: {
                    display: false,
                    ticks: {
                        display: false
                    },
                    grid: {
                        drawOnChartArea: false,
                    }
                },
                y: {
                    display: true,
                    position: 'right',
                    suggestedMin: INITIAL_PRICE-20,
                    suggestedMax: INITIAL_PRICE+20,
                }
            }
        }
    });
}

/**
 * various things to randomize 
 * 1. price
 * 2. the random % being compared (between 0.48 and 0.52)
 * 3. how frequently price updates (between 200ms and 3000ms)
 */

let price = INITIAL_PRICE;
let randomThreshold = 0.5;
let randomPriceRefresh = 100;
let up = 1_000;
let ticks = 2_000;
let volatility = false;

function refreshUI() {
    chart.data.datasets[0].data.shift();
    chart.data.datasets[0].data.push(price);
    chart.update();

    priceText.textContent = `${price.toFixed(2)}`;
    percentText.textContent = `${(up/ticks).toFixed(5)}`;
}

function updatePrice() {
    let coinflip = Math.random() < randomThreshold;
    price += coinflip ? -0.25 : 0.25;
    if (coinflip) up++;
    ticks++;
    // set up when next to change the price
    setTimeout(updatePrice, randomPriceRefresh);
}

function updateRandomPriceRefresh() {
    // random price refresh timer should always fall between 200ms and 3s
    randomPriceRefresh = nextRandomIntervalBetween(100, 2000);
    printLogs();
    // set up when next to change the 
    setTimeout(updateRandomPriceRefresh, nextRandomIntervalBetween(10_000, 120_000));
}

function updateRandomThreshold() {
    if (volatility) {
        // high volatility periods should be between 0.15-0.3 or 0.7-0.85
        randomThreshold = (Math.random() < 0.5 ? 0.15 : 0.7) + ((Math.random() * 3) / 20);
        // price generally refreshes quickly during high vol periods
        randomPriceRefresh = 100;
    } else {
        // normal threshold should always fall between 45 and 55
        randomThreshold = 0.5 + ((Math.random() - 0.5) / 10);
    }
    printLogs();
    setTimeout(updateRandomThreshold, nextRandomIntervalBetween(60_000, 120_000));
}

/**
 * randomly introduce volatility, where volatility is defined as short refreshes & higher threshold
 */
function introduceVolatility() {
    volatility = true;
    let timeout = nextRandomIntervalBetween(5_000, 30_000);
    console.log(`.. scheduled volatility to end @ ${timeout/1000} seconds`);
    setTimeout(stopVolatility, timeout);
}

function stopVolatility() {
    volatility = false;
    let timeout = nextRandomIntervalBetween(60_000, 300_000);
    console.log(`.. scheduled next volatility @ ${timeout/1000} seconds`);
    setTimeout(introduceVolatility, timeout);
}

function printLogs() {
    if (volatility) {
        console.error(`HIGH VOL! Threshold changed: ${randomThreshold}`);
        console.error(`HIGH VOL! Refresh time: ${randomPriceRefresh}`);
        console.error(`HIGH VOL! Price: ${price}`);
        console.error(`HIGH VOL! Ticks: ${ticks}`);
    } else {
        console.log(`>>>>>>>>>>>>>>>>>`);
        console.log(`Threshold changed: ${randomThreshold}`);
        console.log(`Refresh time: ${randomPriceRefresh}`);
        console.log(`Price: ${price}`);
        console.log(`Ticks: ${ticks}`);
    }
}

function nextRandomIntervalBetween(min, max) {
    return (min + (Math.random() * (max-min)));
}

///////////////////////////////////////////////////////////////////
// CHART EXECUTABLE BEGINS
// CHART EXECUTABLE BEGINS
// CHART EXECUTABLE BEGINS
// CHART EXECUTABLE BEGINS
///////////////////////////////////////////////////////////////////

var ctx = document.getElementById('myChart').getContext('2d');
var priceText = document.getElementById('price');
var percentText = document.getElementById('percentage');

initChart(ctx);

// UI is always refreshed every 100ms
setInterval(function() {
    refreshUI();
}, 100);

updatePrice();
updateRandomPriceRefresh();
updateRandomThreshold();
stopVolatility();