
//D:\FrontEnd\Customer-Feedback-Analyzer\customer-feedback-analyzer\js\dashboard.js


// Initialize Firestore
const db = firebase.firestore();

// Initialize charts
let ratingChart, sentimentChart;

// Load dashboard data when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeCharts();
    loadDashboardData();
});

// Initialize Chart.js charts
function initializeCharts() {
    // Rating Distribution Chart
    const ratingCtx = document.getElementById('ratingChart').getContext('2d');
    ratingChart = new Chart(ratingCtx, {
        type: 'bar',
        data: {
            labels: ['1', '2', '3', '4', '5'],
            datasets: [{
                label: 'Number of Ratings',
                data: [0, 0, 0, 0, 0],
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });

    // Sentiment Trend Chart
    const sentimentCtx = document.getElementById('sentimentChart').getContext('2d');
    sentimentChart = new Chart(sentimentCtx, {
        type: 'pie',
        data: {
            labels: ['Positive', 'Neutral', 'Negative'],
            datasets: [{
                data: [0, 0, 0],
                backgroundColor: [
                    'rgba(34, 197, 94, 0.5)',
                    'rgba(59, 130, 246, 0.5)',
                    'rgba(239, 68, 68, 0.5)'
                ],
                borderColor: [
                    'rgb(34, 197, 94)',
                    'rgb(59, 130, 246)',
                    'rgb(239, 68, 68)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Load dashboard data from Firestore
async function loadDashboardData() {
    try {
        const feedbackSnapshot = await db.collection('feedback').get();
        const feedbackData = feedbackSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        updateDashboardStats(feedbackData);
        updateCharts(feedbackData);
        displayRecentFeedback(feedbackData);
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Update dashboard statistics
function updateDashboardStats(feedbackData) {
    // Update total feedback count
    document.getElementById('totalFeedback').textContent = feedbackData.length;

    // Calculate and update average rating
    const totalRating = feedbackData.reduce((sum, feedback) => sum + feedback.rating, 0);
    const averageRating = feedbackData.length > 0 ? (totalRating / feedbackData.length).toFixed(1) : '0.0';
    document.getElementById('averageRating').textContent = averageRating;

    // Update sentiment counts
    const sentimentCounts = feedbackData.reduce((counts, feedback) => {
        counts[feedback.sentiment.category]++;
        return counts;
    }, { positive: 0, neutral: 0, negative: 0 });

    document.getElementById('positiveCount').textContent = sentimentCounts.positive;
    document.getElementById('neutralCount').textContent = sentimentCounts.neutral;
    document.getElementById('negativeCount').textContent = sentimentCounts.negative;
}

// Update charts with new data
function updateCharts(feedbackData) {
    // Update rating distribution chart
    const ratingCounts = feedbackData.reduce((counts, feedback) => {
        counts[feedback.rating - 1]++;
        return counts;
    }, [0, 0, 0, 0, 0]);

    ratingChart.data.datasets[0].data = ratingCounts;
    ratingChart.update();

    // Update sentiment trend chart
    const sentimentCounts = feedbackData.reduce((counts, feedback) => {
        counts[feedback.sentiment.category]++;
        return counts;
    }, { positive: 0, neutral: 0, negative: 0 });

    sentimentChart.data.datasets[0].data = [
        sentimentCounts.positive,
        sentimentCounts.neutral,
        sentimentCounts.negative
    ];
    sentimentChart.update();
}

// Display recent feedback
function displayRecentFeedback(feedbackData) {
    const recentFeedbackContainer = document.getElementById('recentFeedback');
    recentFeedbackContainer.innerHTML = '';

    // Sort feedback by timestamp (newest first) and take the 5 most recent
    const recentFeedback = feedbackData
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5);

    recentFeedback.forEach(feedback => {
        const feedbackElement = document.createElement('div');
        feedbackElement.className = 'border-b border-gray-200 pb-4';
        
        const sentimentColor = {
            positive: 'text-green-600',
            neutral: 'text-blue-600',
            negative: 'text-red-600'
        }[feedback.sentiment.category];

        feedbackElement.innerHTML = `
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <p class="text-gray-800">${feedback.text}</p>
                    <div class="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                        <span>Rating: ${feedback.rating}/5</span>
                        <span class="${sentimentColor}">Sentiment: ${feedback.sentiment.category}</span>
                    </div>
                    <div class="mt-1 text-sm text-gray-500">
                        Keywords: ${feedback.keywords.join(', ')}
                    </div>
                </div>
            </div>
        `;

        recentFeedbackContainer.appendChild(feedbackElement);
    });

    if (recentFeedback.length === 0) {
        recentFeedbackContainer.innerHTML = '<p class="text-gray-500">No feedback submitted yet.</p>';
    }
}

// Set up real-time updates
db.collection('feedback').onSnapshot(snapshot => {
    const feedbackData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    updateDashboardStats(feedbackData);
    updateCharts(feedbackData);
    displayRecentFeedback(feedbackData);
}); 