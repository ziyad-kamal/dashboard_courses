// DOM Elements
const sidebar = document.getElementById('sidebar');
const openSidebarBtn = document.getElementById('openSidebar');
const closeSidebarBtn = document.getElementById('closeSidebar');
let overlay;

// Chart instances
let revenueChart;
let enrollmentChart;
let categoryChart;
let demographicsChart;

// Create overlay element for mobile sidebar
function createOverlay() {
    overlay = document.createElement('div');
    overlay.classList.add('overlay');
    document.body.appendChild(overlay);
    
    overlay.addEventListener('click', () => {
        closeSidebar();
    });
}

// Initialize
function init() {
    createOverlay();
    setupEventListeners();
    setupCharts();
    animateStatCards();
    animateProgressBars();
}

// Set up event listeners
function setupEventListeners() {
    openSidebarBtn.addEventListener('click', openSidebar);
    closeSidebarBtn.addEventListener('click', closeSidebar);
    
    // Add card hover class to all card elements
    document.querySelectorAll('.bg-white.rounded-lg').forEach(card => {
        card.classList.add('card-hover');
    });
    
    // Add responsive classes to tables
    document.querySelectorAll('table').forEach(table => {
        table.classList.add('dashboard-table');
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && sidebar.classList.contains('active')) {
            closeSidebar();
        }
    });

    // Chart period buttons
    document.querySelectorAll('.chart-period-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.chart-period-btn').forEach(b => b.classList.remove('active', 'bg-indigo-100', 'text-indigo-800'));
            document.querySelectorAll('.chart-period-btn').forEach(b => b.classList.add('bg-gray-100', 'text-gray-800'));
            
            btn.classList.remove('bg-gray-100', 'text-gray-800');
            btn.classList.add('active', 'bg-indigo-100', 'text-indigo-800');
            
            updateRevenueChart(btn.dataset.period);
        });
    });

    // Enrollment period buttons
    document.querySelectorAll('.enrollment-period-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.enrollment-period-btn').forEach(b => b.classList.remove('active', 'bg-indigo-100', 'text-indigo-800'));
            document.querySelectorAll('.enrollment-period-btn').forEach(b => b.classList.add('bg-gray-100', 'text-gray-800'));
            
            btn.classList.remove('bg-gray-100', 'text-gray-800');
            btn.classList.add('active', 'bg-indigo-100', 'text-indigo-800');
            
            updateEnrollmentChart(btn.dataset.period);
        });
    });
}

// Open sidebar function
function openSidebar() {
    sidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when sidebar is open
}

// Close sidebar function
function closeSidebar() {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Animate stat cards on page load
function animateStatCards() {
    const statCards = document.querySelectorAll('.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4 > div');
    
    statCards.forEach((card, index) => {
        // Add a small delay for each card
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 * index);
    });
}

// Animate progress bars
function animateProgressBars() {
    const progressBars = document.querySelectorAll('[style*="width"]');
    
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        bar.classList.add('progress-bar-animate');
        
        setTimeout(() => {
            bar.style.width = width;
        }, 300);
    });
}

// Chart data
const chartData = {
    revenue: {
        monthly: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            data: [4500, 5200, 6100, 5800, 7200, 8100, 7800, 8600, 9200, 10500, 11200, 10800]
        },
        quarterly: {
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            data: [15800, 21100, 25600, 32500]
        },
        yearly: {
            labels: ['2019', '2020', '2021', '2022', '2023'],
            data: [64000, 72000, 84500, 95000, 105000]
        }
    },
    enrollments: {
        weekly: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: [32, 45, 39, 55, 48, 62, 75]
        },
        monthly: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            data: [180, 210, 245, 270, 290, 310, 340, 360, 380, 410, 430, 450]
        }
    },
    categories: {
        labels: ['Web Development', 'Data Science', 'Mobile Dev', 'UI/UX Design', 'Business', 'Marketing'],
        data: [35, 25, 15, 10, 8, 7]
    },
    demographics: {
        labels: ['18-24', '25-34', '35-44', '45-54', '55+'],
        male: [18, 25, 15, 8, 4],
        female: [15, 20, 12, 6, 3],
        other: [2, 3, 1, 0.5, 0.5]
    }
};

// Chart setup
function setupCharts() {
    setupRevenueChart();
    setupEnrollmentChart();
    setupCategoryChart();
    setupDemographicsChart();
}

// Revenue Chart
function setupRevenueChart() {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    
    revenueChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.revenue.monthly.labels,
            datasets: [{
                label: 'Revenue ($)',
                data: chartData.revenue.monthly.data,
                borderColor: '#4f46e5',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `$${context.raw.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// Enrollment Chart
function setupEnrollmentChart() {
    const ctx = document.getElementById('enrollmentChart').getContext('2d');
    
    enrollmentChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartData.enrollments.weekly.labels,
            datasets: [{
                label: 'New Students',
                data: chartData.enrollments.weekly.data,
                backgroundColor: '#7c3aed',
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            }
        }
    });
}

// Category Chart (Doughnut)
function setupCategoryChart() {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    
    categoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: chartData.categories.labels,
            datasets: [{
                data: chartData.categories.data,
                backgroundColor: [
                    '#4f46e5', // indigo
                    '#7c3aed', // purple
                    '#06b6d4', // cyan
                    '#10b981', // green
                    '#f59e0b', // amber
                    '#ef4444'  // red
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        boxWidth: 12,
                        font: {
                            size: 11
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw}%`;
                        }
                    }
                }
            },
            cutout: '70%'
        }
    });
}

// Demographics Chart (Stacked Bar)
function setupDemographicsChart() {
    const ctx = document.getElementById('demographicsChart').getContext('2d');
    
    demographicsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartData.demographics.labels,
            datasets: [
                {
                    label: 'Male',
                    data: chartData.demographics.male,
                    backgroundColor: '#4f46e5'
                },
                {
                    label: 'Female',
                    data: chartData.demographics.female,
                    backgroundColor: '#ec4899'
                },
                {
                    label: 'Other',
                    data: chartData.demographics.other,
                    backgroundColor: '#10b981'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw}%`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Age Groups'
                    }
                },
                y: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Percentage (%)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// Update Revenue Chart
function updateRevenueChart(period) {
    revenueChart.data.labels = chartData.revenue[period].labels;
    revenueChart.data.datasets[0].data = chartData.revenue[period].data;
    revenueChart.update();
}

// Update Enrollment Chart
function updateEnrollmentChart(period) {
    enrollmentChart.data.labels = chartData.enrollments[period].labels;
    enrollmentChart.data.datasets[0].data = chartData.enrollments[period].data;
    enrollmentChart.update();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Add some initial styles for animation
document.addEventListener('DOMContentLoaded', () => {
    // Set initial styles for stat cards animation
    const statCards = document.querySelectorAll('.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4 > div');
    statCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
    });
});

// Add pulse effect to notification badge
document.addEventListener('DOMContentLoaded', () => {
    const notificationBadge = document.querySelector('.fa-bell + span');
    if (notificationBadge) {
        notificationBadge.classList.add('pulse');
    }
}); 