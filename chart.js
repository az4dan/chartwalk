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
                },
                zoom: {
                    limits: {
                        y: {
                            min: INITIAL_PRICE-500,
                            max: INITIAL_PRICE+500
                        }
                    },
                    zoom: {
                        wheel: {
                            enabled: true,
                            speed: 0.01
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'y'
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
    if (volatility) {
        // high volatility periods will see price refreshing quicker (every 100-800ms)
        randomPriceRefresh = nextRandomIntervalBetween(100, 800);
        console.error(`HIGH VOL! Updated refresh time: ${randomPriceRefresh} (price: ${price}, ticks: ${ticks})`);
    } else {
        // normally price refreshes slower (every 200ms-2s)
        randomPriceRefresh = nextRandomIntervalBetween(200, 2000);
        console.log(`Updated refresh time: ${randomPriceRefresh} (price: ${price}, ticks: ${ticks})`);
    }
}

function updateRandomThreshold() {
    if (volatility) {
        // high volatility periods should be between 0.15-0.3 or 0.7-0.85
        randomThreshold = (Math.random() < 0.5 ? 0.15 : 0.7) + ((Math.random() * 3) / 20);
        console.error(`HIGH VOL! Threshold changed: ${randomThreshold} (price: ${price}, ticks: ${ticks})`);
    } else {
        // normal threshold should always fall between 45 and 55
        randomThreshold = 0.5 + ((Math.random() - 0.5) / 10);
        console.log(`Threshold changed: ${randomThreshold} (price: ${price}, ticks: ${ticks})`);
    }
}

// price refresh rates will update every 10s to 2 minutes
function updateRandomPriceRefreshWithScheduling() {
    updateRandomPriceRefresh();
    setTimeout(updateRandomPriceRefreshWithScheduling, nextRandomIntervalBetween(10_000, 120_000));
}

// the coinflip threshold will update every 1 to 2 minutes
function updateRandomThresholdWithScheduling() {
    updateRandomThreshold();
    setTimeout(updateRandomThresholdWithScheduling, nextRandomIntervalBetween(60_000, 120_000));
}

// randomly introduce volatility, where volatility is defined as short refreshes & higher threshold
// volatility generally lasts between 10 and 25 seconds
function introduceVolatility() {
    volatility = true;
    updateRandomPriceRefresh();
    updateRandomThreshold();
    let timeout = nextRandomIntervalBetween(10_000, 25_000);
    console.error(`[ scheduled volatility to end @ ${timeout/1000} seconds ]`);
    setTimeout(stopVolatility, timeout);
}

// end volatility period. next volatility period is scheduled between 35 and 85 seconds
function stopVolatility() {
    volatility = false;
    updateRandomPriceRefresh();
    updateRandomThreshold();
    let timeout = nextRandomIntervalBetween(25_000, 85_000);
    console.error(`[ scheduled next volatility @ ${timeout/1000} seconds ]`);
    setTimeout(introduceVolatility, timeout);
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
updateRandomPriceRefreshWithScheduling();
updateRandomThresholdWithScheduling();
stopVolatility();